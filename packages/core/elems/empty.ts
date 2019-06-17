import { Component } from '../dom';
import { e } from './elem';

/**
 * An empty node
 * 
 * It will render as `script`
 */
export const empty = e('script') as Component<{}, any>