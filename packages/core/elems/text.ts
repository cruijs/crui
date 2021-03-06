import { Component } from '../dom';
import { defRendered } from '../dom/rendered';

/**
 * A simple text node
 */
export function text(s: string): Component<{}, {}> {
    return (dom) => defRendered(
        dom.createText(s),
        { tag: '#text' }
    )
}