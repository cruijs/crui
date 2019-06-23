import { Component, Setup } from '@crui/core/dom';
import { result } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';
import { noop } from '@crui/core/utils/noop';
import { Cond$B } from '../rx/box/types';
import { swapNode } from './internals/swapNode';

export function $ite<A, B>(
    $cond: Cond$B,
    cThen: Component<A>,
    cElse: Component<B>
): Setup<A & B> { 
    return (meta, dom, parent, ctxt) => {
        const ar = cThen(dom, ctxt)
        const br = cElse(dom, ctxt)

        const lfc = swapNode(
            $cond,
            (state) => state ? ar : br,
            noop,
            dom, parent
        )
        return result(meta, modify(lfc, (m) => {
            m.unsub = combine([
                m.unsub,
                ar.lfc.unsub,
                br.lfc.unsub,
            ])
        }))
    }
}