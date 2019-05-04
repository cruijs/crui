import { Component, DOM, Tag } from '@crui/core/dom';
import { Cleanup, defCleanup } from '@crui/core/elems/rendered';
import { combine } from '@crui/core/utils/combine';
import { keys } from '@crui/core/utils/object';
import { Stream, Unsubscribe } from '../rx/stream';

export type Bind = {
    checked?: Stream<boolean>,
    value?: Stream<string>,
}

export function h$b(tag: Tag, bind?: Bind): Component {
    return (dom) => {
        const node = dom.create(tag)
        const { beforeUnmount, unsub } = with$Bind(dom, node, bind)
        return {
            node,
            unsub,
            beforeUnmount,
        }
    }
}

export function with$Bind<N>(dom: DOM<N>, node: N, bind?: Bind): Cleanup {
    if (!bind) {
        return defCleanup
    }

    const unsubs: Unsubscribe[] = []
    keys(bind).forEach((prop) => {
        const $s: Stream<any> | undefined = bind[prop]
        if ($s == null) {
            return
        }
        const atomic = makeAtomic()
        unsubs.push(
            dom.listen(node, 'change', atomic(() => {
                $s.set((node as any)[prop])
            })),
            $s.subscribe(atomic((val) => {
                (node as any)[prop] = val
            }))
        )
    })

    return {
        unsub: combine(unsubs),
        beforeUnmount: defCleanup.beforeUnmount
    }
}

type Atomic = <E>(f: (val: E) => void) => (val: E) => void
function makeAtomic(): Atomic {
    let running = true
    return (f) => (e) => {
        if (running) {
            return
        }
        running = true
        f(e)
        running = false
    }
}