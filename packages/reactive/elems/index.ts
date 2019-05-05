import { Component, Tag } from '@crui/core/dom';
import { Config as Base, h } from '@crui/core/elems';
import { mergeCleanups } from '@crui/core/elems/rendered';
import { with$Bind } from './with$Bind';
import { Bind } from './with$Bind';
import { Reactive, with$Props } from './with$Props';

export type Config<P, $P, C> = Base<P, C> & {
    $bind?: Bind,
    $props?: Reactive<$P>
}
export function h$<P, $P, C>(tag: Tag, config: Config<P, $P, C>): Component<C> {
    const component = h(tag, config)
    return (dom, ctxt) => {
        const r = component(dom, ctxt)
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