import { AnyNode, AsyncFn, DOM, Unsubscribe } from '@crui/core/dom';
import { combineMount, combineUnmount, Rendered } from '@crui/core/dom/rendered';
import { last } from '@crui/core/utils/array';
import { combine, combineAsync } from '@crui/core/utils/combine';
import { noop } from '@crui/core/utils/noop';
import { Lifecycle, modLifecycle } from '../../core/dom/rendered';
import { R$L, UpdateType } from '../rx/list/types';
import { Cancel, Guard, makeGuard } from '../utils/guard';

type $Children<N extends AnyNode> = R$L<Rendered<N>> 
/**
 * Dynamically add and remove children from the DOM.
 * 
 * It will not own `$children` and therefore it will not perform any cleanup.
 * It's the user responsibility to destroy `$children` Stream and perform cleanup as appropriate.
 */
export function with$Children<N extends AnyNode>(
    dom: DOM<N>,
    p: N,
    $children: $Children<N>
): Lifecycle {
    const { guard, cancel } = makeGuard()
    const removing: Removing<N> = new Map()
    const replace = makeReplace(
        guard,
        dom,
        removing,
        makeRemoveNode(dom, p, removing)
    )
    const unsub = setupUpdate(dom, p, replace, $children)

    $children.forEach((r) => {
        dom.insert(p, r.node)
    })

    return modLifecycle((m) => {
        m.unsub = combine([
            cancel,
            unsub,
            m.unsub,
        ])
        m.onMounted = combineMount(
            m.onMounted,
            toAsync($children, (r) => r.lfc.onMounted)
        )
        m.onUnmount = combineUnmount(
            m.onMounted,
            toAsync($children, (r) => r.lfc.onUnmount)
        )
    })
}

function setupUpdate<N extends AnyNode>(
    dom: DOM<N>,
    p: N,
    replace: Replace<N>,
    $children: $Children<N>,
): Unsubscribe {
    return $children.subscribe((upd) => {
        switch (upd.type) {
            case UpdateType.Replace:
                replace(upd.oldList, upd.newList, (node) => {
                    dom.insert(p, node)
                })
                return

            case UpdateType.Update: {
                if (upd.newValue === upd.oldValue) {
                    return
                }
                const ref = dom.nextChild(p, upd.oldValue.node)
                replace(
                    [upd.oldValue],
                    [upd.newValue],
                    (node) => {
                        dom.insertBefore(p, ref, node)
                    }
                )
                return
            }

            case UpdateType.Splice: {
                const rl = last(upd.removed)
                const ref = rl ? dom.nextChild(p, rl.node) : null

                replace(upd.removed, upd.added, (node) => {
                    dom.insertBefore(p, ref, node)
                })
                return
            }
        }
    })
}

type ToAsync = <T>(
    list: R$L<T>,
    f: (v: T) => AsyncFn
) => AsyncFn
const toAsync: ToAsync = ($list, f) => () => (
    combineAsync($list.map(f))()
)

type MakeReplace = <N extends AnyNode>(
    guard: Guard,
    dom: DOM<N>,
    removing: Removing<N>,
    removeNode: RemoveNode<N>
) => Replace<N>

type Replace<N extends AnyNode> = (
    toRemove: Rendered<N>[],
    toAdd: Rendered<N>[],
    insert: (node: N) => void
) => Promise<void>

type RemoveNode<N extends AnyNode> = (r: Rendered<N>) => void

const makeReplace: MakeReplace = 
    (guard, dom, removing, removeNode) => (toRemove, toAdd, insert) => {
        const ps = toRemove.map(removeNode)

        toAdd.forEach((r) => {
            const cancel = removing.get(r.node)
            cancel && cancel()
        })

        return Promise.all(ps).then(guard(() => {
            toAdd.forEach((r) => {
                if (removing.has(r.node))
                    removing.delete(r.node)
                else
                    insert(r.node)
            })
            return dom.runOnNextFrame(() =>
                Promise.all(toAdd.map(
                    (r) => r.lfc.onMounted()
                )).then(noop)
            )
        }))
    }

type Removing<N> = Map<N, Cancel> 
function makeRemoveNode<N extends AnyNode>(dom: DOM<N>, parent: N, removing: Removing<N>): RemoveNode<N> {
    return (r: Rendered<N>) => {
        let { guard, cancel } = makeGuard()

        removing.set(r.node, cancel)

        return r.lfc.onUnmount().then(guard(() => {
            dom.remove(parent, r.node)
            removing.delete(r.node)
        }))
    }
}