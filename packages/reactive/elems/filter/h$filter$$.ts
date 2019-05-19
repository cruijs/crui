import { Component } from '@crui/core/dom';
import { combine } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';
import { with$Children } from '../$children';
import { StreamList } from '../../rx/list';
import { $filter$$, $Predicate$ } from '../../rx/list/filter/$filter$$';
import { $map } from '../../rx/list/map';
import { cleanup } from '../../rx/list/cleanup'

export function h$filter$$<T, C, D>( 
    container: Component<C>,
    $list: StreamList<T>,
    child: (item: T) => Component<D>,
    $p$: $Predicate$<T>
): Component<C & D> {
    return (dom, ctxt) => {
        const p = container(dom, ctxt)

        const $mapped = $map($list, (item) => ({
            item,
            r: child(item)(dom, ctxt)
        }))
        $mapped.addUnsub(
            cleanup($mapped, ({ r }) => r.unsub())
        )

        const $filtered$ = $filter$$(
            $mapped,
            $p$,
            (p) => ({ item }) => p(item)
        )
        const $children = $map(
            $filtered$,
            ({ r }) => r
        )

        return modify(
            with$Children(dom, p, $children),
            (m) => {
                m.unsub = combine([
                    m.unsub,
                    $children.destroy,
                    $filtered$.destroy,
                    $mapped.destroy,
                ])
            }
        )
    }
} 