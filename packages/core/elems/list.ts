import { StreamList, UpdateType } from '../../examples/todos/src/rx/list/index';
import { $map } from '../../examples/todos/src/rx/list/map/index';
import { Component, DOM } from '../dom';
import { Rendered, Stream } from '../type';
import { asyncNoop, bindAsync, bindAsync2, last } from '../utils';

export function h$<T, U>(
    $stream: Stream<T, U>,
    make: (val: T) => Component,
    update: <N>(dom: DOM<N>, upd: U, node: N) => void
): Component {
    return (dom) => {
        const r = make($stream.get())(dom)
        const unsub = $stream.subscribe((upd) => {
            update(dom, upd, r.node)
        })
        return {
            node: r.node,
            unmount: bindAsync(r.unmount, unsub)
        }
    }
}

type Guard = (f: () => void) => () => void
const makeReplace = (guard: Guard) => <N>(
    toRemove: Rendered<N>[],
    toAdd: Rendered<N>[],
    insert: (nodes: N[]) => void
) => (
    Promise.all(
        toRemove.map((r) => r.unmount())
    ).then(guard(() => {
        insert(toAdd.map((r) => r.node))
    }))
)

export function h$map<T>(
    container: Component,
    $list: StreamList<T>,
    item: (i: T) => Component
): Component {
    return (dom) => {
        const { node: parent, unmount } = container(dom)

        const render = (todo: T) => item(todo)(dom)
        const r = $map($list, render)
        const $children = r.$list
        let unsub = r.unsub

        $children.forEach((r) => {
            dom.insert(parent, r.node)
        })

        let mounted = true
        const guard: Guard = (f) => () => {
            mounted && f()
        }
        const replace = makeReplace(guard)

        $children.subscribe((upd) => {
            switch (upd.type) {
                case UpdateType.Replace: {
                    replace(upd.oldList, upd.newList, (nodes) => {
                        dom.batchInsert(parent, nodes)
                    })
                    break
                }

                case UpdateType.Update: {
                    const ref = dom.nextChild(parent, upd.oldValue.node)
                    upd.oldValue.unmount().then(guard(() => {
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

        return { 
            node: parent, 
            unmount: bindAsync2(
                asyncNoop,
                () => {
                    mounted = false
                    unsub()
                },
                unmount
            )
        }
    }
}