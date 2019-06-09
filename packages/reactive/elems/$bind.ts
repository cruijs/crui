import { Component, DOM, Tag } from '@crui/core/dom';
import { compatibleInputEvent } from '@crui/core/dom/events';
import { defRendered, modRendered, Rendered } from '@crui/core/dom/rendered';
import { Unsubscribe } from '@crui/core/type';
import { combine } from '@crui/core/utils/combine';
import { keys } from '@crui/core/utils/object';
import { Props } from '../../core/dom/props';
import { DRW$ } from '../rx/types';
import { makeAtomic } from '../utils/atomic';

export type Bind = {
    checked?: DRW$<boolean>,
    value?: DRW$<string>,
}

/**
 * Element with a two-way binding for either `checked` or `value` property.
 * 
 * The bound Stream will update based on property value and viceversa.
 */
export function h$b(tag: Tag, bind?: Bind): Component<any> {
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
        const $s: DRW$<Props[typeof prop]> | undefined = bind[prop]
        if ($s == null) {
            return
        }
        dom.setProp(node, prop, $s.get())

        const atomic = makeAtomic()
        unsubs.push(
            $s.destroy,
            dom.listen(node, event, atomic(() => {
                $s.set(dom.getProp(node, prop))
            })),
        )
        $s.subscribe(atomic((val: boolean | string) => {
            dom.setProp(node, prop, val)
        }))
    })

    return modRendered(node, (r) => {
        r.unsub = combine(unsubs)
    })
}