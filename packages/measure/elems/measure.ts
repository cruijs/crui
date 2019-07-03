import { Component, Tag } from '@crui/core/dom';
import { Meta, modifyLfc } from '@crui/core/dom/rendered';
import { combine, combineAsync } from '@crui/core/utils/combine';
import { WDim } from '../dimensions';
import { enhanceDom } from '../dom/changeDetector';

export function withMeasure<C, T extends Tag>(
    dim: WDim,
    comp: Component<C, Meta<T>>,
): Component<C, Meta<T>> {
    return (dom, ctxt) => {
        const edom = enhanceDom(dom)
        const r = comp(edom, ctxt)

        const doMeasure = () => {
            const rect = dom.measure(r.node)
            dim.top.set(rect.top)
            dim.left.set(rect.left)
            dim.width.set(rect.width)
            dim.height.set(rect.height)
        }

        return modifyLfc(r, (m) => {
            m.unsub = combine([
                m.unsub,
                dom.onWindowResize(doMeasure),
                edom.onChange(doMeasure),
            ])
            m.onMounted = combineAsync([
                () => dom.runOnNextFrame(doMeasure),
                m.onMounted,
            ])
        })
    }
}