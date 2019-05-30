import { Component, DOM, Tag } from '../dom';
import { KProps, PProps } from '../dom/props';
import { withChildren } from './children';
import { Events, withEvents } from './events';
import { withProps } from './props';
import { defRendered, mergeRendered, Rendered } from './rendered';

export type Config<K extends KProps, C> = {
    props?: PProps<K>,
    events?: Events,
    children?: Component<C>[],
}

export function h<K extends KProps, C>(tag: Tag, config?: Config<K, C>): Component<C> {
    return (dom, ctxt) => {
        const node = dom.create(tag)
        return withAll(dom, ctxt, node, config)
    }
}

type WithAll = <N, C, K extends KProps>(
    dom: DOM<N>,
    context: C,
    node: N,
    config?: Config<K, C>,
) => Rendered<N>

export const withAll: WithAll = (dom, ctxt, node, config) => {
    if (config == null) {
        return defRendered(node)
    }
    withProps(dom, node, config.props)
    return mergeRendered(node, [
        withChildren(dom, ctxt, node, config.children),
        withEvents(dom, node, config.events),
    ])
}