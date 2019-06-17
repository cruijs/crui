import { ws } from '@crui/core/combinators/combinator';
import { Component } from '@crui/core/dom';
import { $CSS, with$CSS } from '../elems/$css';

/**
 * Add dynamic CSS classes to a Component
 * @see h$ss
 */
export function w$ss<C, M>(comp: Component<C>, style: $CSS<M>): Component<C> {
    return ws(comp, (dom, node) => 
        with$CSS(dom, node, style)
    )
}