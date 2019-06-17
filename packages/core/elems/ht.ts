import { Component, Tag } from '../dom/index';
import { children } from './children';
import { h } from './h';
import { text } from './text';

/**
 * A simple element with just one text child
 * 
 * It's a combination of `hc` and `text`.
 */
export function ht<T extends Tag>(tag: T, txt: string): Component<T> {
    return h(tag, [children([
        text(txt)
    ])])
}