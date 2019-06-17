import { combine } from '@crui/core/utils/combine';
import { StreamBox } from '../stream';
import { DR$B, R$B } from '../types';

export function zip3<A, B, C, Z>(
    a: R$B<A>,
    b: R$B<B>,
    c: R$B<C>,
    f: (a: A, b: B, c: C) => Z
): DR$B<Z> {
    const z = new StreamBox(f(a.get(), b.get(), c.get()))
    const sub = () => {
        z.set(f(a.get(), b.get(), c.get()))
    }
    z.addUnsub(combine([
        a.subscribe(sub),
        b.subscribe(sub),
        c.subscribe(sub),
    ]))
    return z
}