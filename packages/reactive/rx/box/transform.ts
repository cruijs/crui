import { makeAtomic } from '../../utils/atomic';
import { StreamBox } from './stream';
import { DRW$B, RW$B } from './types';

/**
 * Transform a stream and setup a two-way binding between the two.
 * Useful to be used with `$bind`
 */
export function transform<T, P>(
    source: RW$B<T>,
    g: (val: T) => P,
    s: (val: P) => T,
): DRW$B<P> {
    const z = new StreamBox(g(source.get()))
    const atomic = makeAtomic()
    z.subscribe(atomic((val) => {
        source.set(s(val))
    }))
    z.addUnsub(
        source.subscribe(atomic((val) => { 
            z.set(g(val))
        }))
    )
    return z
}