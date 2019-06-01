import { Component, Tag } from '../dom/index';
import { defRendered } from './rendered';

/**
 * A vanilla element
 */
export function e(tag: Tag): Component {
    return (dom) => defRendered(
        dom.create(tag)
    )
}