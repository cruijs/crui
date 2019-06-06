import { Component } from '@crui/core/dom';
import { modRendered } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { noop } from '@crui/core/utils/noop';
import { StreamBox } from '../rx/box';
import { makeGuard } from '../utils/guard';
import { modify } from '@crui/reactive/node_modules/@crui/core/utils/modify';

export function $ite<A, B>(
    $cond: StreamBox<boolean>,
    cThen: Component<A>,
    cElse: Component<B>
): Component<A & B> { 
    return (dom, ctxt) => {
        const ar = cThen(dom, ctxt)
        const br = cElse(dom, ctxt)

        const get = () => 
            $cond.get() ? ar : br

        const z = modRendered(get().node, (r) => {
            r.onMounted = () => get().onMounted()
            r.onUnmount = () => get().onUnmount()
            r.unsub = combine([
                ar.unsub,
                br.unsub,
                $cond.destroy
            ])
        })

        let cancel = noop
        $cond.subscribe((state) => {
            cancel()

            const g = makeGuard()
            const guard = g.guard
            cancel = g.cancel

            const rm = state ? br : ar
            const add = state ? ar : br
            modify(z, (m) => m.node = add.node)

            rm.onUnmount().then(guard(() => {
                dom.replace(rm.node, add.node)
                return add.onMounted()
            }))
        })

        return z
    }
}