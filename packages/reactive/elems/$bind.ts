import { Component, DOM } from '@crui/core/dom';
import { compatibleInputEvent } from '@crui/core/dom/events';
import { KProps, Props } from '@crui/core/dom/props';
import { modLifecycle, Rendered, defRendered } from '@crui/core/dom/rendered';
import { Unsubscribe } from '../../core/types';
import { combine } from '@crui/core/utils/combine';
import { DRW$B } from '../rx/box/types';
import { makeAtomic } from '../utils/atomic';

export type BVTag = 'input'|'select'|'textarea'
export type BCTag = 'input'

export type $Value = DRW$B<string>
export type $Checked = DRW$B<boolean>

/**
 * Create an element and set a two-way binding on `value` property
 */
export function h$bv(tag: BVTag, stream: $Value): Component {
    return (dom) => {
        const node = dom.create(tag)
        return with$BindVal(stream)(dom, node)
    }
}

/**
 * Create a checkbox element and set a two-way binding on `checked` property
 */
export function h$bc(stream: $Checked): Component {
    return (dom) => {
        const node = dom.create('input')
        dom.setProp(node, 'type', 'checkbox')
        return with$BindCheck(stream)(dom, node)
    }
}

export const with$BindVal = (stream?: $Value) => bind('value', stream)
export const with$BindCheck = (stream?: $Checked) => bind('checked', stream)

type Enhance = <N>(dom: DOM<N>, node: N) => Rendered<N>
const bind = <P extends KProps>(
   prop: P, stream?: DRW$B<Props[P]>
): Enhance => (dom, node) => {
    if (stream == null) {
        return defRendered(node)
    }

    const unsubs: Unsubscribe[] = []
    const event = compatibleInputEvent(node)
        dom.setProp(node, prop, stream.get())

        const atomic = makeAtomic()
        unsubs.push(
            stream.destroy,
            dom.listen(node, event, atomic(() => {
                stream.set(dom.getProp(node, prop))
            })),
        )
        stream.subscribe(atomic((val: Props[P]) => {
            dom.setProp(node, prop, val)
        }))

    return modLifecycle(node, (r) => {
        r.unsub = combine(unsubs)
    })
}