import { Component, DOM, Tag } from '../dom';
import { combine } from '../utils/combine';
import { Modifiable } from '../utils/modify';
import { keys } from '../utils/object';
import { defRendered, Rendered } from './rendered';

export type Events = {
    change?: EventListener
    click?: EventListener
}

/**
 * An element with events
 */
export function he(tag: Tag, on?: Events): Component {
    return (dom) => {
        const node = dom.create(tag)
        return withEvents(dom, node, on)
    }
}

/**
 * Add events to a node
 */
export function withEvents<N>(dom: DOM<N>, elem: N, on?: Events): Rendered<N> {
    const r = defRendered(elem)
    if (on) {
        (r as Modifiable<Rendered<N>>).unsub = combine(
            keys(on).map((event) =>
                dom.listen(elem, event, on[event]!)
            )
        )
    }
    return r
}