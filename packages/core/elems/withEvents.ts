import { Component, DOM, Node, Tag } from '../dom';
import { combine } from '../utils/combine';
import { keys } from '../utils/object';
import { Cleanup, defCleanup } from './rendered';

export type Events = {
    change?: EventListener
    click?: EventListener
}

export function he(tag: Tag, on?: Events): Component {
    return (dom) => {
        const node = dom.create(tag)
        const { beforeUnmount, unsub } = withEvents(dom, node, on)
        return { node, beforeUnmount, unsub }
    }
}

export function withEvents(dom: DOM, elem: Node, on?: Events): Cleanup {
    return !on ? defCleanup : {
        beforeUnmount: defCleanup.beforeUnmount,
        unsub: combine(
            keys(on).map((event) =>
                dom.listen(elem, event, on[event]!)
            )
        )
    }
}