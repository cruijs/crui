import { apply } from './apply';
import { StreamBox } from './stream';
import { DR$B, R$B } from './types';

export function flatMap<T, P>(box: R$B<T>, f: (b: T) => DR$B<P>): DR$B<P> {
    let br = f(box.get())
    const z = new StreamBox(br.get())
    br.subscribe(z.set)

    z.addUnsub(() => br.destroy())
    z.addUnsub(
        box.subscribe((val) => {
            br.destroy()
            br = f(val)
            apply(br, z.set)
        })
    )

    return z
}