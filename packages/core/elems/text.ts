import { Component } from '../dom/index';
import { defRendered } from './rendered'

export function text(s: string): Component {
    return (dom) => defRendered(
        dom.createText(s)
    )
}