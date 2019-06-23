import { Component, Setup } from '@crui/core/dom';
import { result } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';
import { R$L } from '../rx/list';
import { cleanup } from '../rx/list/cleanup';
import { $filter$$, $Predicate$ } from '../rx/list/filter/$filter$$';
import { $map } from '../rx/list/map';
import { with$Children } from './internals/children';

/**
 * Setup a dynamic list of children that are also filtered
 */
export function s$filter$$<T, C>(
    $list: R$L<T>,
    child: (item: T) => Component<C>,
    $p$: $Predicate$<T>
): Setup<C> {
    return (meta, dom, parent, ctxt) => {
        const $mapped = $map($list, (item) => ({
            item,
            r: child(item)(dom, ctxt)
        }))
        $mapped.addUnsub(
            cleanup($mapped, ({ r }) => r.lfc.unsub())
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

        return result(
            meta, 
            modify(with$Children(dom, parent, $children), (m) => {
                m.unsub = combine([
                    m.unsub,
                    $children.destroy,
                    $filtered$.destroy,
                    $mapped.destroy,
                ])
            })
        )
    }
} 