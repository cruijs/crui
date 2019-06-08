import { Component, Tag } from '../dom';
import { defRendered } from '../dom/rendered';

/**
 * A vanilla element
 */
export function e(tag: Tag): Component<any> {
    return (dom) => defRendered(
        dom.create(tag)
    )
}