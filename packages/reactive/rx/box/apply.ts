import { Effect } from '../types';
import { R$B } from './types';

/**
 * Subscribe & run effect
 */
export function apply<T>(stream: R$B<T>, eff: Effect<T>) {
    eff(stream.get())
    return stream.subscribe(eff)
}