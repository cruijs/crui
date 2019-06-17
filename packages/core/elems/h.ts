import { Component, Setup } from '../dom';
import { Meta, rendered } from '../dom/rendered'
import { Tag } from '../types';

/**
 * An element for which anything can be configured.
 */
export function h<T extends Tag, C>(tag: T, setup: Setup<C, Meta<T>>): Component<C, Meta<T>> {
    return (dom, ctxt) => {
        const node = dom.create(tag)
        const s = setup({ tag }, dom, node, ctxt)

        return rendered(node, s.lfc, s.meta)
    }
}