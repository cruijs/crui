import { Component } from '@crui/core/dom';
import { modifyLfc } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { noop } from '@crui/core/utils/noop';
import { Cond$B } from '../rx/box/types';
import { swapNode } from './internals/swapNode';

export function $ite<A, B>(
    $cond: Cond$B,
    cThen: Component<A>,
    cElse: Component<B>
): Component<A & B> { 
    return (dom, ctxt) => {
        const ar = cThen(dom, ctxt)
        const br = cElse(dom, ctxt)

        const r = swapNode(dom, $cond,
            (state) => state ? ar : br,
            noop
        )
        return modifyLfc(r, (m) => {
            m.unsub = combine([
                m.unsub,
                ar.lfc.unsub,
                br.lfc.unsub,
            ])
        })
    }
}