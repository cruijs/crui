import { combine2 } from '@crui/core/utils/combine';
import { StreamBox } from './box';

export function zip<A, B, C>(a: StreamBox<A>, b: StreamBox<B>, f: (a: A, b: B) => C): StreamBox<C> {
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