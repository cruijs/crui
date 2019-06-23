import { Component } from '../dom'
import { children } from '../setups/children'
import { rendered } from '../dom/rendered';

export function fragment<C>(cs: Component<C>[]): Component<C, {}> {
    return (dom, ctxt) => {
        const node = dom.createFragment()
        const meta = {}
        const r = children(cs)(meta, dom, node, ctxt)
        return rendered(node, r.lfc, meta)
    }
}