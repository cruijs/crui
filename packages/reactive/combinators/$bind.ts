import { combinator } from '@crui/core/combinators/combinator';
import { Component } from '@crui/core/dom';
import { Bind, with$Bind } from '../elems/$bind';

/**
 * Enhance a Component to with a two-way binding.
 */
export function w$b<C>(comp: Component<C>, bind: Bind): Component<C> {
    return combinator(comp, (dom, node) =>
        with$Bind(dom, node, bind)
    )
}

/**
 * Enhance a Component with a two-way binding on `value` property
 */
export function $bindVal<C>(comp: Component<C>, value: Bind['value']) {
    return w$b(comp, { value })
}

/**
 * Enhance a Component with a two-way binding on `checked` property
 */
export function $bindCheck<C>(comp: Component<C>, checked: Bind['checked']) {
    return w$b(comp, { checked })
}