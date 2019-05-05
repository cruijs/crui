import { Component, DOM } from '../dom';
import { Tag } from '../dom/index';
import { Cleanup, defCleanup, mergeCleanups } from './rendered'

export function hc<C>(tag: Tag, children?: Component<C>[]): Component<C> {
    return (dom, ctxt) => {
        const node = dom.create(tag)
        const { beforeUnmount, unsub } = withChildren(dom, ctxt, node, children)
        return { node, beforeUnmount, unsub }
    }
}
export function withChildren<N, C>(
    dom: DOM<N>,
    ctxt: C,
    parent: N,
    children?: Component<C>[]
): Cleanup {
    if (!children || children.length === 0) {
        return defCleanup
    }

    return mergeCleanups(
        children.map((render) => {
            const r = render(dom, ctxt)
            dom.insert(parent, r.node)
            return r
        })
    )
}