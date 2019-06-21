import { AnyTag, Component, Tag } from '@crui/core/dom';
import { modifyLfc } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { with$Children } from '../../setups/internals/$children';
import { R$L } from '../../rx/list';
import { cleanup } from '../../rx/list/cleanup';
import { $filter$$, $Predicate$ } from '../../rx/list/filter/$filter$$';
import { $map } from '../../rx/list/map';
import { mergeLifecycles } from '../../../core/dom/rendered'

/**
 * Enhance a Component with dynamic children that are also filtered
 */
export function h$filter$$<T extends Tag, I, C, D>( 
    container: Component<T, C>,
    $list: R$L<I>,
    child: (item: I) => Component<AnyTag, D>,
    $p$: $Predicate$<I>
): Component<T, C & D> {
    return (dom, ctxt) => {
        const p = container(dom, ctxt)

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

        return modifyLfc(p, (m) => {
            Object.assign(m, mergeLifecycles([
                m,
                with$Children(dom, p.node, $children)
            ]))
            m.unsub = combine([
                m.unsub,
                $children.destroy,
                $filtered$.destroy,
                $mapped.destroy,
            ])
        })
    }
} 