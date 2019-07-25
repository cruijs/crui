import { Setup } from '../dom';
import { text } from '../elems/text';
import { child } from './children';

/**
 * Append a new text node to Element
 */
export function ctext<M>(str: string): Setup<{}, M> {
    return child(text(str))
}