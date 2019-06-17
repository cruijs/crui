import { Setup } from '@crui/core/dom';
import { compatibleInputEvent } from '@crui/core/dom/events';
import { KProps, Props } from '@crui/core/dom/props';
import { modLifecycle } from '@crui/core/dom/rendered';
import { Unsubscribe } from '@crui/core/types';
import { combine } from '@crui/core/utils/combine';
import { DRW$B } from '../rx/box/types';
import { makeAtomic } from '../utils/atomic';

export type BVTag = 'input' | 'select' | 'textarea'
export type BCTag = 'input'
type Tag = BVTag | BCTag

export type $Value = DRW$B<string>
export type $Checked = DRW$B<boolean>

export const bindVal = <T extends BVTag>(stream: $Value): Setup<T> => bind('value', stream)
export const bindCheck = (stream: $Checked): Setup<BCTag> => (dom, node, ctxt) => {
    dom.setProp(node, 'type', 'checkbox')
    return bind('checked', stream)(dom, node, ctxt)
}

const bind = <T extends Tag, P extends KProps>(
   prop: P, stream: DRW$B<Props[P]>
): Setup<T> => (dom, node) => {
    dom.setProp(node, prop, stream.get())

    const atomic = makeAtomic()
    const unsubs: Unsubscribe[] = []
    const event = compatibleInputEvent(node)
    unsubs.push(
        stream.destroy,
        dom.listen(node, event, atomic(() => {
            stream.set(dom.getProp(node, prop))
        })),
    )
    stream.subscribe(atomic((val: Props[P]) => {
        dom.setProp(node, prop, val)
    }))

    return modLifecycle((r) => {
        r.unsub = combine(unsubs)
    })
}