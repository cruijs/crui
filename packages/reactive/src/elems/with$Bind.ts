import { Stream, Unsubscribe } from '../rx/stream';

type Bind = {
    checked?: Stream<boolean>,
    value?: Stream<string>,
}

export function withBind<E extends Node>(dom: DOM<E>, elem: E, bind?: Bind): Unsubscribe[] {
    if (!bind || !(elem instanceof HTMLInputElement)) {
        return []
    }

    const unsub: Unsubscribe[] = []
    keys(bind).forEach((prop) => {
        const atomic = makeAtomic()
        const $s: Stream<any> = bind[prop]!
        unsub.push(
            dom.listen(elem, 'change', atomic(() => {
                $s.set(elem[prop])
            })),
            $s.subscribe(atomic((val) => {
                elem[prop] = val
            }))
        )
    })
    return unsub
}