import { text } from '../elems/text';
import { child } from './children';

/**
 * Append a new text node to Element
 */
export function addText(str: string) {
    return child(text(str))
}