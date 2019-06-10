import { StreamBox } from './stream';
import { DR$B, R$B } from './types';

export type FMap<A, B> = (v: A) => B
/**
 * Create a new StreamBox with value mapped, similiar to Array.map
 */
export function map<T, P>(source: R$B<T>, f: FMap<T, P>): DR$B<P> {
    const $box = new StreamBox(f(source.get()))
        $box.addUnsub(source.subscribe((val) => {
        $box.set(f(val))
    }))
    return $box
}