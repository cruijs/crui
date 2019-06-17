import { Component, Setup } from '../dom';
import { mergeLifecycles, rendered } from '../dom/rendered';
import { Tag } from '../types';

/**
 * An element for which anything can be configured.
 * It's a mix of all other base Components in this package, but slightly less efficient.
 */
export function h<T extends Tag, C>(tag: T, configs: Setup<T, C>[]): Component<T, C> {
    return (dom, ctxt) => {
        const node = dom.create(tag)
        return rendered(node, mergeLifecycles(
            configs.map((config) => config(dom, node, ctxt))
        ))
    }
}