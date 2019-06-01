import { Component } from '../dom';
import { withProps } from '../elems/props';

/**
 * Add properties to a Component.
 * Please note that if a Component already have a property set, it will be overwritten
 */
export function wp<C, P>(comp: Component<C>, props: P): Component<C> {
    return (dom, ctxt) => {
        const r = comp(dom, ctxt)
        withProps(dom, r.node, props)
        return r
    }
}