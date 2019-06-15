import { combinator } from '@crui/core/combinators/combinator';
import { Component } from '@crui/core/dom';
import { $Checked, $Value, with$BindCheck, with$BindVal } from '../elems/$bind';

/**
 * Enhance a Component with a two-way binding on `value` property
 */
export function $bindVal<C>(comp: Component<C>, stream: $Value) {
    return combinator(comp, with$BindVal(stream))
}

/**
 * Enhance a Component with a two-way binding on `checked` property
 */
export function $bindCheck<C>(comp: Component<C>, stream: $Checked) {
    return combinator(comp, with$BindCheck(stream))
}