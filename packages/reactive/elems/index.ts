import { Component, Tag } from '@crui/core/dom';
import { Config as Base, h } from '@crui/core/elems';
import { mergeCleanups } from '@crui/core/elems/rendered';
import { with$Bind } from './with$Bind';
import { Bind } from './with$Bind';
import { Reactive, with$Props } from './with$Props';

export type Config<P, $P> = Base<P> & {
    $bind?: Bind,
    $props?: Reactive<$P>
}
export function h$<P, $P>(tag: Tag, config: Config<P, $P>): Component {
    const component = h(tag, config)
    return (dom) => {
        const r = component(dom)
        const { unsub, beforeUnmount } = mergeCleanups([
            r,
            with$Props(r.node, config.$props!),
            with$Bind(dom, r.node, config.$bind)
        ])
        return {
            node: r.node,
            unsub,
            beforeUnmount
        }
    }
}