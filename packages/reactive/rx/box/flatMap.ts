import { R$ } from '../types';
import { StreamBox } from './stream';
import { DR$B } from './types';

export function flatMap<T, P>(box: R$<T>, f: (b: T) => DR$B<P>): DR$B<P> {
    let br = f(box.get())
    const z = new StreamBox(br.get())
    br.subscribe(z.set)

    z.addUnsub(br.destroy)
    z.addUnsub(
        box.subscribe((val) => {
            br.destroy()
            br = f(val)
            br.apply(z.set)
        })
    )

    return z
}