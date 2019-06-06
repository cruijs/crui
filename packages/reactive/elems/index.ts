import { Component, Tag, DOM } from '@crui/core/dom';
import { KProps } from '@crui/core/dom/props';
import { mergeRendered, Rendered } from '@crui/core/dom/rendered';
import { Config as Base, withAll } from '@crui/core/elems';
import { Unsubscribe } from '@crui/core/type';
import { combine } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';
import { Bind, with$Bind } from './$bind';
import { $Props, with$Props } from './$props';
import { defRendered } from '../../core/dom/rendered'

export type Config<C, K extends KProps, $K extends KProps> = Base<K, C> & {
    $bind?: Bind,
    $props?: $Props<$K>
    unsub?: Unsubscribe,
}
export function h$<C, K extends KProps, $K extends KProps>(tag: Tag, config: Config<C, K, $K>): Component<C> {
    return (dom, ctxt) =>
        with$All(dom, ctxt, dom.create(tag), config)
}

type WithAll = <N, C, K extends KProps, $K extends KProps>(
    dom: DOM<N>,
    context: C,
    node: N,
    config?: Config<C, K, $K>,
) => Rendered<N>
export const with$All: WithAll = (dom, ctxt, node, config) =>
    (config == null)
        ? defRendered(node)
        : withUnsub(config.unsub, mergeRendered(node, [
            withAll(dom, ctxt, node, config),
            with$Props(dom, node, config.$props),
            with$Bind(dom, node, config.$bind),
        ]))

const withUnsub = <N>(unsub: Unsubscribe | undefined, r: Rendered<N>) => (
    unsub
        ? modify(r, (m) => {
            m.unsub = combine([r.unsub, unsub])
        })
        : r
)