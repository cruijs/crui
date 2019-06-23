import { Tag } from '@crui/core/dom';
import { h } from '@crui/core/elems/h';
import { Interpolation } from 'emotion';
import { css } from '../setups/css';

/**
 * An element with CSS
 */
export function hss<T extends Tag, S>(tag: T, style: Interpolation<S>) {
    return h(tag, [css(style)])
}