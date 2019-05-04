import { Component, DOM } from '@crui/core/dom';
import { Rendered } from '@crui/core/elems/rendered';
import { last } from '@crui/core/utils/array';
import { combine } from '@crui/core/utils/combine';
import { StreamList, UpdateType } from '../rx/list';
import { $map } from '../rx/list/map';
import { Unsubscribe } from '../rx/stream';

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

type Replace = <N>(
    toRemove: Rendered<N>[],
    toAdd: Rendered<N>[],
    insert: (nodes: N[]) => void
) => Promise<void>

const makeReplace = (guard: Guard): Replace => (toRemove, toAdd, insert) => (
    Promise.all(
        toRemove.map(unmount)
    ).then(guard(() => {
        insert(toAdd.map((r) => r.node))
    }))
)

function unmount(r: Rendered): PromiseLike<void> {
    return r.beforeUnmount().then(r.unsub)
}

export function h$map<T>(
    container: Component,
    $list: StreamList<T>,
    item: (i: T) => Component
): Component {
    return (dom) => {
        const p = container(dom)

        const render = (todo: T) => item(todo)(dom)
        const r = $map($list, render)
        const $children = r.$list

        $children.forEach((r) => {
            dom.insert(p.node, r.node)
        })

        return { 
            node: p.node, 
            beforeUnmount: p.beforeUnmount,
            unsub: combine([
                setup(dom, p.node, $children),
                r.unsub,
            ])
        }
    }
}

function setup<N>(dom: DOM<N>, parent: N, $children: StreamList<Rendered<N>>): Unsubscribe {
    const { guard, prevent } = makeGuard()
    const replace = makeReplace(guard)

    const unsub = $children.subscribe((upd) => {
        switch (upd.type) {
            case UpdateType.Replace: {
                replace(upd.oldList, upd.newList, (nodes) => {
                    dom.batchInsert(parent, nodes)
                })
                break
            }

            case UpdateType.Update: {
                const ref = dom.nextChild(parent, upd.oldValue.node)
                unmount(upd.oldValue).then(guard(() => {
                    dom.insertBefore(parent, ref, upd.newValue.node)
                }))
                break
            }

            case UpdateType.Splice: {
                const rl = last(upd.removed)
                const ref = rl ? dom.nextChild(parent, rl.node) : null

                replace(upd.removed, upd.added, (ns) => {
                    dom.batchInsertBefore(parent, ref, ns)
                })
                break
            }
        }
    })

    return () => {
        prevent()
        unsub()
    }
}