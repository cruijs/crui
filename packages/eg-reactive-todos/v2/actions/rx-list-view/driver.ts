import { StreamList, UpdateType } from '@crui/reactive/rx/list'
import { joinAll, pipe } from '../../deferred'
import { cleanup, Cleanup } from '../cleanup/index'
import { $Children, $children } from '../rx-children'
import { MakeItem } from '../template'
import { ListViewDriver, ListViewType, Tpl } from './index'

type AReq<N> = Cleanup|$Children<N>
export const makeListViewDriver = <N, T extends object = any, E extends Tpl<T, N> = any>(
): ListViewDriver<T, E, N, AReq<N>> => ({
    [ListViewType]: (parent, { stream, template }, { emit }) => {
        const cache = new Map<T, N>()
        const $nodes = new StreamList<N>([])

        pipe(emit(parent, template), (render) => {
            withNodes(cache, render, stream.get(), (nodes) => {
                $nodes.set(nodes)
            })

            stream.subscribe((upd) => {
                switch (upd.type) {
                    case UpdateType.Update:
                        let node = cache.get(upd.newValue)
                        if (node === undefined) {
                            pipe(render(upd.newValue), (node) => {
                                $nodes.update(upd.index, node)
                            })
                        }
                        else {
                            $nodes.update(upd.index, node)
                        }
                        return

                    case UpdateType.Replace:
                        withNodes(cache, render, upd.newList, (rs) => {
                            $nodes.set(rs)
                        })
                        return

                    case UpdateType.Splice:
                        withNodes(cache, render, upd.added, (rs) => {
                            $nodes.splice(upd.index, upd.removed.length, rs)
                        })
                        return
                }
            })
        })

        emit(parent, $children($nodes))
        emit(parent, cleanup(() => {
            stream.destroy()
            cache.clear()
        }))
    }
})

function withNodes<N, T extends object>(
    cache: Map<T, N>,
    render: MakeItem<T, N>,
    list: T[],
    f: (rs: N[]) => void
): void {
    const toRender = [] as ({ index: number, item: T })[]
    const rendered: N[] = list.map((item, i) => {
        const n = cache.get(item)
        if (n == null)
            toRender.push({ index: i, item })
 
        return n!
    })

    if (toRender.length === 0) {
        f(rendered)
        return
    }
    pipe(
        joinAll(toRender.map(({ item }) => render(item))),
        (nodes) => {
            nodes.forEach((n, i) => {
                const { item, index } = toRender[i]

                // due to async, cache could have been populated
                // so discard the new node if that happens
                if (cache.has(item))
                    n = cache.get(item)!
                else
                    cache.set(item, n)

                rendered[index] = n
            })
            f(rendered)
        }
    )
}