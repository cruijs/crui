import { Component, Meta, Setup, Tag } from '../dom';
import { mergeLifecycles, rendered } from '../dom/rendered';

/**
 * Apply a new Setup to a Component
 */
export function setup<C, D, T extends Tag>(
    comp: Component<C, Meta<T>>,
    stp: Setup<D, Meta<T>>
): Component<C & D, Meta<T>> {
    return (dom, ctxt) => {
        const c = comp(dom, ctxt)
        const s = stp(c.meta, dom, c.node, ctxt)
        return rendered(c.node, mergeLifecycles([c.lfc, s.lfc]), s.meta)
    }
}