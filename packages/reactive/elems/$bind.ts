import { Component, DOM, Tag } from '@crui/core/dom';
import { compatibleInputEvent } from '@crui/core/dom/events';
import { defRendered, modRendered, Rendered } from '@crui/core/elems/rendered';
import { combine } from '@crui/core/utils/combine';
import { keys } from '@crui/core/utils/object';
import { Stream, Unsubscribe } from '../rx/stream';

export type Bind = {
    checked?: Stream<boolean>,
    value?: Stream<string>,
}

/**
 * Element with a two-way binding for either `checked` or `value` property.
 * 
 * The bound Stream will update based on property value and viceversa.
 */
export function h$b(tag: Tag, bind?: Bind): Component {
    return (dom) => {
        const node = dom.create(tag)
        return with$Bind(dom, node, bind)
    }
}

/**
 * Setup a node with a two-way binding for either `checked` or `value` property.
 */
export function with$Bind<N>(dom: DOM<N>, node: N, bind?: Bind): Rendered<N> {
    if (!bind) {
        return defRendered(node)
    }

    const unsubs: Unsubscribe[] = []
    const event = compatibleInputEvent(node)
    keys(bind).forEach((prop) => {
        const $s = bind[prop]
        if ($s == null) {
            return
        }
        dom.setProp(node, prop, $s.get())

        const atomic = makeAtomic()
        unsubs.push(
            dom.listen(node, event, atomic(() => {
                ($s as any).set(dom.getProp(node, prop))
            })),
            $s.subscribe(atomic((val: boolean|string) => {
                dom.setProp(node, prop, val)
            }))
        )
    })

    return modRendered(node, (r) => {
        r.unsub = combine(unsubs)
    })
}

type Atomic = <E>(f: (val: E) => void) => (val: E) => void
function makeAtomic(): Atomic {
    let running = false
    return (f) => (e) => {
        if (running) {
            return
        }
        running = true
        f(e)
        running = false
    }
}