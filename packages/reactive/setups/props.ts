import { Meta, Setup, Tag } from '@crui/core/dom';
import { KProps, PProps } from '@crui/core/dom/props';
import { modLifecycle, result } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { keys } from '@crui/core/utils/object';
import { Reactive } from '../utils/reactive';

export type $Props<K extends KProps> = Reactive<PProps<K>>

/**
 * Setup an element with dynamic properties
 */
export function $props<T extends Tag, K extends KProps>(props: $Props<K>): Setup<{}, Meta<T>> {
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