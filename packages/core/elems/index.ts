import { DOM, Tag } from '../dom';
import { Component } from '../dom/index';
import { Cleanup, defCleanup, mergeCleanups } from './rendered';
import { withChildren } from './children';
import { Events, withEvents } from './events';
import { Lifecycle, withLifecycles } from './lifecycles';
import { withProps } from './props';

export type Config<P, C> = {
    props?: P,
    events?: Events,
    children?: Component<C>[],
    lifecycles?: Lifecycle,
}

export function h<P, C>(tag: Tag, config?: Config<P, C>): Component<C> {
    return (dom, ctxt) => {
        const node = dom.create(tag)
        const { beforeUnmount, unsub } = withAll(dom, ctxt, node, config)
        return { node, beforeUnmount, unsub }
    }
}

type WithAll = <N, C, P>(
    dom: DOM<N>,
    context: C,
    node: N,
    config?: Config<P, C>,
) => Cleanup

export const withAll: WithAll = (dom, ctxt, node, config) => {
    if (config == null) {
        return defCleanup
    }
    withProps(node, config.props)
    return mergeCleanups([
        withChildren(dom, ctxt, node, config.children),
        withEvents(dom, node, config.events),
        withLifecycles(node, config.lifecycles),
    ])
}