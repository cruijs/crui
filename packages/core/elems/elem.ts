import { AnyTag, Component } from '../dom';
import { defRendered } from '../dom/rendered';

/**
 * A vanilla element
 */
export function e<T extends AnyTag>(tag: T): Component<T> {
    return (dom) => defRendered(
        dom.create(tag)
    )
}

export const empty = e('script')
export const br = e('br')