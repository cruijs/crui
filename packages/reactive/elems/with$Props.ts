import { Component, Tag } from '@crui/core/dom';
import { Rendered } from '@crui/core/elems/rendered';
import { combine } from '@crui/core/utils/combine';
import { keys } from '@crui/core/utils/object';
import { Stream } from '../rx/stream';
import { defRendered, modRendered } from '../../core/elems/rendered'

export function h$p<P>(tag: Tag, props: Reactive<P>): Component {
    return (dom) => {
        const node = dom.create(tag)
        return with$Props(node, props)
    }
}

export type Reactive<P extends {}> = {[K in keyof P]: Stream<P[K]>}
export function with$Props<N, P extends keyof N>(
    node: N,
    props?: Reactive<{ [K in P]: N[P] }>
): Rendered<N> {
    return !props ?
        defRendered(node) :
        modRendered(node, (r) => {
            r.unsub = combine(keys(props).map((k) => {
                node[k] = props[k].get()
                return props[k].subscribe((val) => {
                    node[k] = val
                })
            }))
        })
}