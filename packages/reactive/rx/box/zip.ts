import { combine2 } from '@crui/core/utils/combine';
import { R$ } from '../types';
import { StreamBox } from './stream';
import { DR$B } from './types';

export function zip<A, B, C>(a: R$<A>, b: R$<B>, f: (a: A, b: B) => C): DR$B<C> {
    const c = new StreamBox(f(a.get(), b.get()))
    const sub = () => {
        c.set(f(a.get(), b.get()))
    }
    c.addUnsub(combine2(
        a.subscribe(sub),
        b.subscribe(sub)
    ))
    return c
}