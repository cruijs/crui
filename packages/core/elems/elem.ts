import { Component, Meta } from '../dom';
import { defRendered } from '../dom/rendered';

/**
 * A vanilla element
 */
export function e<T extends string>(tag: T): Component<{}, Meta<T>> {
    return (dom) => defRendered(dom.create(tag), { tag })
}