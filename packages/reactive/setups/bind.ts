import { Setup } from '@crui/core/dom';
import { compatibleInputEvent } from '@crui/core/dom/events';
import { KProps, Props } from '@crui/core/dom/props';
import { Meta, modLifecycle, result, SetupR } from '@crui/core/dom/rendered';
import { Unsubscribe } from '@crui/core/types';
import { combine } from '@crui/core/utils/combine';
import { DRW$B } from '../rx/box/types';
import { makeAtomic } from '../utils/atomic';

export type BVTag = 'input' | 'select' | 'textarea'
export type BCTag = 'input'

export type $Value = DRW$B<string>
export type $Checked = DRW$B<boolean>

type MSetup<T> = Setup<{}, Meta<T>>

export const bindValue = <T extends BVTag>(stream: $Value): MSetup<T> => bind('value', stream)

export const bindChecked = (stream: $Checked): MSetup<BCTag> => (meta, dom, node, ctxt) => {
    dom.setProp(node, 'type', 'checkbox')
    return bind('checked', stream)(meta, dom, node, ctxt) as SetupR<Meta<BCTag>>
}

const bind = <T, P extends KProps>(
   prop: P, stream: DRW$B<Props[P]>
): MSetup<T> => (meta, dom, node) => {
    dom.setProp(node, prop, stream.get())

    const atomic = makeAtomic()
    const unsubs: Unsubscribe[] = []
    const event = compatibleInputEvent(node)
    unsubs.push(
        stream.destroy,
        dom.listen(node, event, atomic(() => {
            stream.set(dom.getProp(node, prop) as Props[P])
        })),
    )
    stream.subscribe(atomic((val: Props[P]) => {
        dom.setProp(node, prop, val)
    }))

    return result(meta, modLifecycle((r) => {
        r.unsub = combine(unsubs)
    }))
}