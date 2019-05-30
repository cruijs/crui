import { DOM } from '@crui/core/dom/index';
import { combineMount, combineUnmount, Rendered } from '@crui/core/elems/rendered';
import { AsyncFn } from '@crui/core/type';
import { last } from '@crui/core/utils/array';
import { combine, combineAsync } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';
import { noop } from '@crui/core/utils/noop';
import { StreamList, UpdateType } from '../rx/list/index';
import { Unsubscribe } from '../rx/stream';

type $Children<N> = StreamList<Rendered<N>> 
/**
 * Dynamically add and remove children from the DOM.
 * 
 * It will not own `$children` and therefore it will not perform any cleanup.
 * It's the user responsibility to destroy `$children` and perform cleanup as appropriate.
 */
export function with$Children<N>(
    dom: DOM<N>,
    p: Rendered<N>,
    $children: $Children<N>
): Rendered<N> {
    const { guard, prevent } = makeGuard()
    const removing: Removing<N> = new Map()
    const replace = makeReplace(
        guard,
        dom,
        removing,
        makeRemoveNode(dom, p.node, removing)
    )
    const unsub = setupUpdate(dom, p, replace, $children)

    $children.forEach((r) => {
        dom.insert(p.node, r.node)
    })

    return modify(p, (m) => {
        m.unsub = combine([
            prevent,
            unsub,
            m.unsub,
        ])
        m.onMounted = combineMount(
            m.onMounted,
            toAsync($children, (r) => r.onMounted)
        )
        m.onUnmount = combineUnmount(
            m.onMounted,
            toAsync($children, (r) => r.onUnmount)
        )
    })
}

function setupUpdate<N>(
    dom: DOM<N>,
    p: Rendered<N>,
    replace: Replace<N>,
    $children: $Children<N>,
): Unsubscribe {
    return $children.subscribe((upd) => {
        switch (upd.type) {
            case UpdateType.Replace:
                replace(upd.oldList, upd.newList, (node) => {
                    dom.insert(p.node, node)
                })
                return

            case UpdateType.Update: {
                if (upd.newValue === upd.oldValue) {
                    return
                }
                const ref = dom.nextChild(
                    p.node,
                    upd.oldValue.node
                )
                replace(
                    [upd.oldValue],
                    [upd.newValue],
                    (node) => {
                        dom.insertBefore(p.node, ref, node)
                    }
                )
                return
            }

            case UpdateType.Splice: {
                const rl = last(upd.removed)
                const ref = rl ? dom.nextChild(p.node, rl.node) : null

                replace(upd.removed, upd.added, (node) => {
                    dom.insertBefore(p.node, ref, node)
                })
                return
            }
        }
    })
}

type ToAsync = <T>(
    list: StreamList<T>,
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
    toRemove: Rendered<N>[],
    toAdd: Rendered<N>[],
    insert: (node: N) => void
) => Promise<void>

type RemoveNode<N> = (r: Rendered<N>) => void

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
                    (r) => r.onMounted()
                )).then(noop)
            )
        }))
    }

type Guard = (f: () => void) => () => void
const makeGuard = () => {
    let canRun = true
    const guard: Guard = (f) => () => {
        canRun && f()
    }
    const prevent = () => {
        canRun = false
    }
    return { guard, prevent }
}

type Removing<N> = Map<N, Cancel> 
type Cancel = () => void
function makeRemoveNode<N>(dom: DOM<N>, parent: N, removing: Removing<N>): RemoveNode<N> {
    return (r: Rendered<N>) => {
        let { guard, prevent } = makeGuard()

        removing.set(r.node, prevent)

        return r.onUnmount().then(guard(() => {
            dom.remove(parent, r.node)
            removing.delete(r.node)
        }))
    }
}