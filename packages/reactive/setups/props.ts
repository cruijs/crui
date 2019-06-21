import { Setup } from '@crui/core/dom';
import { KProps, PProps } from '@crui/core/dom/props';
import { modLifecycle, result } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { keys } from '@crui/core/utils/object';
import { Reactive } from '../utils/reactive';

export type $Props<K extends KProps> = Reactive<PProps<K>>

/**
 * Setup an element with dynamic properties
 */
export function $props<K extends KProps, M>(props: $Props<K>): Setup<{}, M> {
    return (meta, dom, node) => result(
        meta, 
        modLifecycle((r) => {
            r.unsub = combine(keys(props).map((k) => {
                dom.setProp(node, k, props[k].get())
                props[k].subscribe((val) => {
                    dom.setProp(node, k, val)
                })
                return props[k].destroy
            }))
        })
    )
}