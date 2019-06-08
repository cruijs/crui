import { Component } from '@crui/core/dom';
import { combine } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';
import { noop } from '@crui/core/utils/noop';
import { StreamBox } from '../rx/box';
import { swapNode } from './utils/swapNode';

export function $ite<A, B>(
    $cond: StreamBox<boolean>,
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
        return modify(r, (m) => {
            m.unsub = combine([
                m.unsub,
                ar.unsub,
                br.unsub,
            ])
        })
    }
}