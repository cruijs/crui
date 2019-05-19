import { Component, DOM, Tag } from '../dom';
import { defRendered, mergeRendered, Rendered } from './rendered';

export function hc<C>(tag: Tag, children?: Component<C>[]): Component<C> {
    return (dom, ctxt) => {
        const node = dom.create(tag)
        return withChildren(dom, ctxt, node, children)
    }
}
export function withChildren<N, C>(
    dom: DOM<N>,
    ctxt: C,
    parent: N,
    children?: Component<C>[]
): Rendered<N> {
    if (!children || children.length === 0) {
        return defRendered(parent)
    }

    return mergeRendered(
        parent,
        children.map((render) => {
            const r = render(dom, ctxt)
            dom.insert(parent, r.node)
            return r
        })
    )
}