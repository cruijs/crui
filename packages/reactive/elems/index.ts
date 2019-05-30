import { Component, Tag } from '@crui/core/dom';
import { KProps } from '@crui/core/dom/props';
import { Config as Base, withAll } from '@crui/core/elems';
import { mergeRendered, Rendered } from '@crui/core/elems/rendered';
import { Unsubscribe } from '@crui/core/type';
import { combine } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';
import { Bind, with$Bind } from './$bind';
import { $Props, with$Props } from './$props';

export type Config<C, K extends KProps> = Base<K, C> & {
    $bind?: Bind,
    $props?: $Props<K>
    unsub?: Unsubscribe,
}
export function h$<C, K extends KProps>(tag: Tag, config: Config<C, K>): Component<C> {
    return (dom, ctxt) => {
        const node = dom.create(tag)

        return withUnsub(config.unsub, mergeRendered(node, [
            withAll(dom, ctxt, node, config),
            with$Props(dom, node, config.$props),
            with$Bind(dom, node, config.$bind),
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