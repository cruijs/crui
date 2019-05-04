import { Component, DOM } from '../dom';
import { Tag } from '../dom/index';
import { Cleanup, defCleanup, mergeCleanups } from './rendered'

export function hc(tag: Tag, children?: Component[]): Component {
    return (dom) => {
        const node = dom.create(tag)
        const { beforeUnmount, unsub } = withChildren(dom, node, children)
        return { node, beforeUnmount, unsub }
    }
}
export function withChildren<N>(dom: DOM<N>, parent: N, children?: Component[]): Cleanup {
    if (!children || children.length === 0) {
        return defCleanup
    }

    return mergeCleanups(
        children.map((render) => {
            const r = render(dom)
            dom.insert(parent, r.node)
            return r
        })
    )
}