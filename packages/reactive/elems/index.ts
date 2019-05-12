import { Component, Tag } from '@crui/core/dom';
import { Config as Base, h } from '@crui/core/elems';
import { mergeRendered } from '@crui/core/elems/rendered';
import { combine } from '@crui/core/utils/combine';
import { Rendered } from '../../core/elems/rendered';
import { Unsubscribe } from '../../core/type';
import { modify } from '../../core/utils/modify';
import { Bind, with$Bind } from './with$Bind';
import { Reactive, with$Props } from './with$Props';

export type Config<P, $P, C> = Base<P, C> & {
    $bind?: Bind,
    $props?: Reactive<$P>,
    unsub?: Unsubscribe,
}
export function h$<P, $P, C>(tag: Tag, config: Config<P, $P, C>): Component<C> {
    const component = h(tag, config)
    return (dom, ctxt) => {
        const r = component(dom, ctxt)

        return withUnsub(config.unsub, mergeRendered(r.node, [
            r,
            with$Props(r.node, config.$props!),
            with$Bind(dom, r.node, config.$bind),
        ]))
    }
}

const withUnsub = <N>(unsub: Unsubscribe|undefined, r: Rendered<N>) => (
    unsub 
        ? modify(r, (m) => {
            m.unsub = combine([r.unsub, unsub])
        })
        : r
)