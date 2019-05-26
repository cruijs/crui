import { Component } from '../dom/index'
import { withChildren } from '../elems/children'
import { mergeRendered } from '../elems/rendered'

export function wc<C, D>(parent: Component<C>, children: Component<D>[]): Component<C & D> {
    return (dom, ctxt) => {
        const rp = parent(dom, ctxt)

        const rc = withChildren(
            dom, ctxt,
            rp.node,
            children
        )

        return mergeRendered(rp.node, [rp, rc])
    }
}