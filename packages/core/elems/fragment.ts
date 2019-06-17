import { Component, Tag } from '../dom'
import { rendered } from '../dom/rendered'
import { children } from './children'

export function fragment<C>(cs: Component<Tag, C>[]): Component<'#fragment', C> {
    return (dom, ctxt) => {
        const node = dom.createFragment()
        return rendered(node, children(cs)(dom, node, ctxt))
    }
}