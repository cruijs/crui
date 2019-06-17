import { text } from '../elems/text';
import { child } from './children';

/**
 * Append a new text node to Element
 */
export function ctext(str: string) {
    return child(text(str))
}