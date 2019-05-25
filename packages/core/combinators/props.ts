import { Component } from '../dom/index';
import { withProps } from '../elems/props';

export function wp<C, P>(comp: Component<C>, props: P): Component<C> {
    return (dom, ctxt) => {
        const r = comp(dom, ctxt)
        withProps(r.node, props)
        return r
    }
}