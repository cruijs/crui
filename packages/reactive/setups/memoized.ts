import { Component, Setup } from '@crui/core/dom';
import { result } from '@crui/core/dom/rendered';
import { combine2 } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';
import { Rendered } from '../../core/dom/rendered';
import { R$L } from '../rx';
import { $map } from '../rx/list/map';
import { with$Children } from './internals/children';
/**
 * Render a Stream List of item while memoizing it.
 * 
 * Every rendered node will be cached based on item identity and will not be
 * destroyed unless the whole list is destroyed
 */
export function c$memoized<T, C, M>(
    $list: R$L<T>,
    render: (item: T) => Component<C, any>
): Setup<C, M> {
    return (meta, dom, node, ctxt) => {
        const cache = new Map<T, Rendered<any>>()
        const $rs = $map(
            $list,
            (item) => {
                let r = cache.get(item)
                if (r == null) {
                    r = render(item)(dom, ctxt)
                    cache.set(item, r)
                }
                return r
            }
        )
        return result(meta, modify(
            with$Children(dom, node, $rs),
            (m) => {
                m.unsub = combine2(m.unsub, () => {
                    $rs.destroy()
                    cache.forEach((r) => {
                        r.lfc.unsub()
                    })
                })
            }
        ))
    }
}