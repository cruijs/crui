import { Component, DOM, Tag } from '@crui/core/dom';
import { KProps, PProps } from '@crui/core/dom/props';
import { defRendered, modRendered, Rendered } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { keys } from '@crui/core/utils/object';
import { Reactive } from '../utils/reactive';

export type $Props<K extends KProps> = Reactive<PProps<K>>

/**
 * Element with dynamic properties
 */
export function h$p<K extends KProps>(tag: Tag, props: $Props<K>): Component<any> {
    return (dom) => {
        const node = dom.create(tag)
        return with$Props(dom, node, props)
    }
}

/**
 * Setup a node with dynamic properties
 */
export function with$Props<N, K extends KProps>(
    dom: DOM<N>,
    node: N,
    props?: $Props<K>,
): Rendered<N> {
    return !props ?
        defRendered(node) :
        modRendered(node, (r) => {
            r.unsub = combine(keys(props).map((k) => {
                dom.setProp(node, k, props[k].get())
                return props[k].subscribe((val) => {
                    dom.setProp(node, k, val)
                })
            }))
        })
}