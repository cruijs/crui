import { Component, Setup } from '../dom';
import { mergeLifecycles, rendered } from '../dom/rendered';

/**
 * Apply a new Setup to a Component
 */
export function setup<C, D, M>(
    comp: Component<C, M>,
    stp: Setup<D, M>
): Component<C & D, M> {
    return (dom, ctxt) => {
        const c = comp(dom, ctxt)
        const s = stp(c.meta, dom, c.node, ctxt)
        return rendered(c.node, mergeLifecycles([c.lfc, s.lfc]), s.meta)
    }
}