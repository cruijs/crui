import { Component, DOM } from '@crui/core/dom';
import { Rendered } from '@crui/core/elems/rendered';
import { last } from '@crui/core/utils/array';
import { asyncBind, combine, combineAsync } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';
import { noop } from '@crui/core/utils/noop';
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

type MakeReplace = <N>(
    guard: Guard,
    dom: DOM<N>,
    parent: N
) => Replace<N>

type Replace<N> = (
    toRemove: Rendered<N>[],
    toAdd: Rendered<N>[],
    insert: (node: N) => void
) => Promise<void>

const makeReplace: MakeReplace = 
    (guard, dom, parent) => (toRemove, toAdd, insert) => (
        Promise.all(
            toRemove.map(onUnmount)
        ).then(guard(() => {
            toRemove.forEach((r) => {
                dom.remove(parent, r.node)
            })
            toAdd.forEach((r) => {
                insert(r.node)
            })
            return dom.runOnMount(() =>
                Promise.all(toAdd.map(
                    (r) => r.onMounted()
                )).then(noop)
            )
        }))
    )

function onUnmount(r: Rendered): PromiseLike<void> {
    return r.onUnmount().then(r.unsub)
}

export function h$map<T>(
    container: Component,
    $list: StreamList<T>,
    item: (i: T) => Component
): Component {
    return (dom, ctxt) => {
        const p = container(dom, ctxt)

        const render = (todo: T) => item(todo)(dom, ctxt)
        const mapRes = $map($list, render)
        const $children = mapRes.$list

        $children.forEach((r) => {
            dom.insert(p.node, r.node)
        })

        return modify(p, (m) => { 
            m.unsub = combine([
                setup(dom, p.node, $children),
                mapRes.unsub,
                p.unsub,
            ])
            m.onMounted = asyncBind(
                p.onMounted,
                () => combineAsync(
                    $children.map((r) => r.onMounted)
                )(),
            )
            m.onUnmount = asyncBind(
                () => combineAsync(
                    $children.map((r) => r.onUnmount)
                )(),
                p.onUnmount,
            )
        })
    }
}

function setup<N>(dom: DOM<N>, parent: N, $children: StreamList<Rendered<N>>): Unsubscribe {
    const { guard, prevent } = makeGuard()
    const replace = makeReplace(guard, dom, parent)

    const unsub = $children.subscribe((upd) => {
        switch (upd.type) {
            case UpdateType.Replace: {
                replace(upd.oldList, upd.newList, (node) => {
                    dom.insert(parent, node)
                })
                break
            }

            case UpdateType.Update: {
                const ref = dom.nextChild(
                    parent,
                    upd.oldValue.node
                )
                replace(
                    [upd.oldValue],
                    [upd.newValue],
                    (node) => {
                        dom.insertBefore(parent, ref, node)
                    }
                )
                break
            }

            case UpdateType.Splice: {
                const rl = last(upd.removed)
                const ref = rl ? dom.nextChild(parent, rl.node) : null

                replace(upd.removed, upd.added, (node) => {
                    dom.insertBefore(parent, ref, node)
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