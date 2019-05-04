import { Component, Tag } from '@crui/core/dom';
import { combine } from '@crui/core/utils/combine';
import { noop } from '@crui/core/utils/noop';
import { keys } from '@crui/core/utils/object';
import { asyncNoop } from '@crui/core/utils/noop';
import { Stream, Unsubscribe } from '../rx/stream';
import { Cleanup, defCleanup } from '../../core/elems/rendered'

export function h$p<P>(tag: Tag, props: Reactive<P>): Component {
    return (dom) => {
        const node = dom.create(tag)
        const { unsub, beforeUnmount } = with$Props(node, props)
        return {
            node,
            unsub,
            beforeUnmount
        }
    }
}

export type Reactive<P extends {}> = {[K in keyof P]: Stream<P[K]>}
export function with$Props<N, P extends keyof N>(
    node: N,
    props?: Reactive<{ [K in P]: N[P] }>
): Cleanup {
    return !props ? defCleanup : {
        beforeUnmount: defCleanup.beforeUnmount,
        unsub: combine(keys(props).map((k) => {
            node[k] = props[k].get()
            return props[k].subscribe((val) => {
                node[k] = val
            })
        }))
    }
}