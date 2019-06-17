import { Component, Tag } from '../dom';
import { defRendered } from '../dom/rendered';

/**
 * A vanilla element
 */
export function e<T extends Tag>(tag: T): Component<T> {
    return (dom) => defRendered(
        dom.create(tag)
    )
}

export const empty = e('script')