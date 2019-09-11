import { AsyncFn, DOM, Unsubscribe } from '@crui/core/dom';
import { combineMount, combineUnmount, Lifecycle, modLifecycle, Rendered } from '@crui/core/dom/rendered';
import { combine, combineAsync } from '@crui/core/utils/combine';
import { noop } from '@crui/core/utils/noop';
import { R$L, UpdateType } from '../../rx/list/types';
import { Cancel, Guard, makeGuard } from '../../utils/guard';

type Meta = { mounted?: boolean }
type $Children<N> = R$L<Rendered<N, Meta>> 
/**
 * Dynamically add and remove children from the DOM.
 * 
 * It will not own `$children` and therefore it will not perform any cleanup.
 * It's the user responsibility to destroy `$children` Stream and perform cleanup as appropriate.
 */
export function with$Children<N>(
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
        r.meta.mounted = true
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

function setupUpdate<N>(
    dom: DOM<N>,
    p: N,
    replace: Replace<N>,
    $children: $Children<N>,
): Unsubscribe {
    return $children.subscribe((upd) => {
        switch (upd.type) {
            case UpdateType.Replace:
                replace(upd.oldList, upd.newList, (r) => {
                    dom.insert(p, r.node)
                })
                return

            case UpdateType.Update: {
                if (upd.newValue === upd.oldValue) {
                    return
                }
                replace(
                    [upd.oldValue],
                    [upd.newValue],
                    (r) => {
                        const ref = findNext($children, r)
                        dom.insertBefore(p, ref, r.node)
                    }
                )
                return
            }

            case UpdateType.Splice: {
                replace(upd.removed, upd.added, (r) => {
                    const ref = findNext($children, r)
                    dom.insertBefore(p, ref, r.node)
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

type MakeReplace = <N>(
    guard: Guard,
    dom: DOM<N>,
    removing: Removing<N>,
    removeNode: RemoveNode<N>
) => Replace<N>

type Replace<N> = (
    toRemove: Rendered<N, Meta>[],
    toAdd: Rendered<N, Meta>[],
    insert: (node: Rendered<N>) => void
) => Promise<void>

type RemoveNode<N> = (r: Rendered<N>) => void

const makeReplace: MakeReplace = 
    (guard, dom, removing, removeNode) => (toRemove, toAdd, insert) => {
        toAdd.forEach((r) => {
            const cancel = removing.get(r.node)
            cancel && cancel()
        })
        const ps = toRemove.map(removeNode)

        return Promise.all(ps).then(guard(() => {
            toAdd.forEach((r) => {
                if (removing.has(r.node))
                    removing.delete(r.node)
                else {
                    insert(r)
                    r.meta.mounted = true
                }
            })
            return dom.runOnNextFrame(() =>
                Promise.all(toAdd.map(
                    (r) => r.lfc.onMounted()
                )).then(noop)
            )
        }))
    }

type Removing<N> = Map<N, Cancel> 
function makeRemoveNode<N>(dom: DOM<N>, parent: N, removing: Removing<N>): RemoveNode<N> {
    return (r: Rendered<N, Meta>) => {
        let { guard, cancel } = makeGuard()

        removing.set(r.node, cancel)

        return r.lfc.onUnmount().then(guard(() => {
            r.meta.mounted = false
            dom.remove(parent, r.node)
            removing.delete(r.node)
        }))
    }
}

function findNext<N>($children: $Children<N>, r: Rendered<N, Meta>): N|null {
    const list = $children.get()
    let index = list.lastIndexOf(r) + 1

    let rr = list[index]
    while (rr != null && !rr.meta.mounted) {
        rr = list[++index]
    }

    return rr ? rr.node : null
}