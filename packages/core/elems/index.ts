import { DOM, Tag } from '../dom';
import { Component } from '../dom/index';
import { withChildren } from './children';
import { Events, withEvents } from './events';
import { withProps } from './props';
import { defRendered, mergeRendered, Rendered } from './rendered';

export type Config<P, C> = {
    props?: P,
    events?: Events,
    children?: Component<C>[],
}

export function h<P, C>(tag: Tag, config?: Config<P, C>): Component<C> {
    return (dom, ctxt) => {
        const node = dom.create(tag)
        return withAll(dom, ctxt, node, config)
    }
}

type WithAll = <N, C, P>(
    dom: DOM<N>,
    context: C,
    node: N,
    config?: Config<P, C>,
) => Rendered<N>

export const withAll: WithAll = (dom, ctxt, node, config) => {
    if (config == null) {
        return defRendered(node)
    }
    withProps(node, config.props)
    return mergeRendered(node, [
        withChildren(dom, ctxt, node, config.children),
        withEvents(dom, node, config.events),
    ])
}