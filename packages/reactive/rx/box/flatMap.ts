import { StreamBox } from './index';

export function flatMap<A, B>(box: StreamBox<A>, f: (b: A) => StreamBox<B>): StreamBox<B> {
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