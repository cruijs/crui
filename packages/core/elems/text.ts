import { Component } from '../dom/index';
import { defRendered } from './rendered'

/**
 * A simple text node
 */
export function text(s: string): Component {
    return (dom) => defRendered(
        dom.createText(s)
    )
}