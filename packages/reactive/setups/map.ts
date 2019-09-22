import { Component, Setup } from '@crui/core/dom';
import { result } from '@crui/core/dom/rendered';
import { modify } from '@crui/core/utils/modify';
import { R$L } from '../rx';
import { $map as l$map, FMap } from '../rx/list/map';
import { with$Children } from './internals/children';
import { combine2 } from '../../core/utils/combine'
import { cleanup } from '../rx/list/cleanup'

/**
 * Children Stream Map
 * 
 * Map a stream of items T into children and add them in the element
 */
export function c$map<T, C, M>(
    $list: R$L<T>,
    render: FMap<T, Component<C, any>>
): Setup<C, M> {
    return (meta, dom, node, ctxt) => {
        const $rs = l$map(
            $list,
            (item, index) => render(item, index)(dom, ctxt)
        )
        $rs.addUnsub(
            cleanup($rs, (r) => { r.lfc.unsub() })
        )

        return result(meta, modify(
            with$Children(dom, node, $rs),
            (m) => {
                m.unsub = combine2(m.unsub, $rs.destroy)
            }
        ))
    }
}