import { Component, DOM, Tag } from '../dom';
import { defRendered, Rendered } from '../dom/rendered';
import { combine } from '../utils/combine';
import { Modifiable } from '../utils/modify';
import { keys } from '../utils/object';
import { noop } from '../utils/noop';

export type Events = {
    change?: EventListener
    click?: EventListener
    submit?: EventListener
    load?: EventListener
    error?: EventListener
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
            keys(on).map((event) => {
                const handler = on[event]
                return handler ? dom.listen(elem, event, handler) : noop
            })
        )
    }
    return r
}