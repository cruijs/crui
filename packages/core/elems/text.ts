import { Component } from '../dom/index';
import { defCleanup } from './rendered';

export function text(s: string): Component {
    return (dom) => ({
        ... defCleanup,
        node: dom.createText(s),
    })
}