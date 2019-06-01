import { Component } from '../dom';
import { withChildren } from '../elems/children';
import { combinator } from './combinator';

/**
 * Append children to a Component
 */
export function wc<C, D>(parent: Component<C>, children: Component<D>[]): Component<C & D> {
    return combinator<C, D>(parent, (dom, node, ctxt) =>
        withChildren(dom, ctxt, node, children)
    )
}