import { AnyNodeAction, bind, Cleanup, cleanup, Deferred, joinAll, MakeItem, map, pipe, Template, template as tpl, then, waitAll } from '@crui/core'
import { StreamList, Update, UpdateType } from '../../rx/list'
import { opBatch, opReplace, opSplice, opUpdate } from '../../rx/list/operations/factory'
import { $Children, $children } from '../children'
import { ListViewDriver, ListViewType } from './index'

type AReq<N> = Template<any, any, N>|Cleanup|$Children<N>
export const makeListViewDriver = <N, T extends object = any, E extends AnyNodeAction = any>(
): ListViewDriver<N, T, E, AReq<N>> => ({
    [ListViewType]: (parent, { stream, template }, { emit }) => {
        const cache = new Map<T, N>()
        const $nodes = new StreamList<N>([])

        emit(parent, cleanup(() => {
            $nodes.destroy()
            cache.clear()
        }))

        return waitAll([
            emit(parent, $children($nodes)),
            bind(emit(parent, tpl(template) as Template<any, any, N>), (render) => {
                const withNodes = makeRenderNodes<N, T>(new Map(), render)

                stream.subscribe((upd) => {
                    pipe(
                        opMap(withNodes, upd),
                        (op) => $nodes.apply(op)
                    )
                })

                return then(
                    withNodes(stream.get()),
                    (nodes) => $nodes.set(nodes)
                )
            })
        ])
    }
})

function opMap<T, N>(render: RenderNodes<T, N>, upd: Update<T>): Deferred<Update<N>> {
    switch (upd.type) {
        case UpdateType.Update:
            return map(
                render([upd.oldValue, upd.newValue]), 
                ([prev, next]) => opUpdate(upd.index, prev, next) as Update<N>
            )

        case UpdateType.Replace:
            return map(
                joinAll([
                    render(upd.oldList),
                    render(upd.newList)
                ]),
                ([prevs, nexts]) => opReplace(prevs, nexts) as Update<N>
            )

        case UpdateType.Splice:
            return map(
                joinAll([
                    render(upd.removed),
                    render(upd.added)
                ]),
                ([prevs, nexts]) => opSplice(upd.index, prevs, nexts) as Update<N>
            )

        case UpdateType.Batch:
            return map(
                joinAll(upd.ops.map(
                    (op) => opMap(render, op)
                )),
                (ns) => opBatch(ns) as Update<N>
            )
    }
}

type RenderNodes<T, N> = 
    (list: readonly T[]) => Deferred<readonly N[]>

function makeRenderNodes<N, T extends object>(
    cache: Map<T, Deferred<N>>,
    render: MakeItem<T, N>,
): RenderNodes<T, N> {
    return (list) => joinAll(
        list.map((item) => {
            let d = cache.get(item)

            if (d == null) {
                d = render(item)
                cache.set(item, d)
            }
    
            return d
        })
    )
}