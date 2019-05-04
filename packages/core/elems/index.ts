import { DOM, Tag } from '../dom';
import { Component } from '../dom/index';
import { AsyncUnmount } from '../type';
import { asyncNoop } from '../utils/noop';
import { Cleanup, defCleanup, mergeCleanups } from './rendered';
import { withChildren } from './withChildren';
import { Events, withEvents } from './withEvents';
import { Lifecycle, withLifecycles } from './withLifecycles';
import { withProps } from './withProps';

export type Config<P> = {
    props?: P,
    events?: Events,
    children?: Component[],
    lifecycles?: Lifecycle,
}

export function h<P>(tag: Tag, config?: Config<P>): Component {
    return (dom) => {
        const node = dom.create(tag)
        const { beforeUnmount, unsub } = withAll(dom, node, config)
        return { node, beforeUnmount, unsub }
    }
}

type WithAll = <N, P>(
    dom: DOM<N>,
    node: N,
    config?: Config<P>,
) => Cleanup

export const withAll: WithAll = (dom, node, config) => {
    if (config == null) {
        return defCleanup
    }
    withProps(node, config.props)
    return mergeCleanups([
        withChildren(dom, node, config.children),
        withEvents(dom, node, config.events),
        withLifecycles(node, config.lifecycles),
    ])
}