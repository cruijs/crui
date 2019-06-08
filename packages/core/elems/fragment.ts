import { Component } from '../dom'
import { withChildren } from './children'

export function fragment<C>(children: Component<C>[]): Component<C> {
    return (dom, ctxt) => {
        return withChildren(dom, ctxt, dom.createFragment(), children)
    }
}