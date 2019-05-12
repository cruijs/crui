import { Component, Tag } from '../dom/index';
import { defRendered } from './rendered';

export function e(tag: Tag): Component {
    return (dom) => defRendered(
        dom.create(tag)
    )
}