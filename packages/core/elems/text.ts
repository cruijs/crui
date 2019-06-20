import { Component } from '../dom';
import { defRendered, Meta } from '../dom/rendered';

/**
 * A simple text node
 */
export function text(s: string): Component<{}, Meta<'#text'>> {
    return (dom) => defRendered(
        dom.createText(s),
        { tag: '#text' }
    )
}