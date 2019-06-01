import { Component } from '@crui/core/dom';
import { mergeRendered } from '@crui/core/dom/rendered';
import { Bind, with$Bind } from '../elems/$bind';
import { Stream } from '../rx/stream';

/**
 * Enhance a Component to with a two-way binding.
 */
export function w$b<C>(comp: Component<C>, bind: Bind): Component<C> {
    return (dom, ctxt) => {
        const r = comp(dom, ctxt)

        return mergeRendered(r.node, [
            r,
            with$Bind(dom, r.node, bind)
        ])
    }
}

/**
 * Enhance a Component with a two-way binding on `value` property
 */
export function $bindVal<C>(comp: Component<C>, value: Stream<string>) {
    return w$b(comp, { value })
}

/**
 * Enhance a Component with a two-way binding on `checked` property
 */
export function $bindCheck<C>(comp: Component<C>, checked: Stream<boolean>) {
    return w$b(comp, { checked })
}