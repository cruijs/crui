import { Component, Tag } from '../dom/index';
import { text } from './text';
import { hc } from './children';

/**
 * A simple element with just one text child
 * 
 * It's a combination of `hc` and `text`.
 */
export function ht(tag: Tag, txt: string): Component<any> {
    return hc(tag, [
        text(txt)
    ])
}