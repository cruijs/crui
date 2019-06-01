import { Component } from '../dom/index';
import { Events, withEvents } from '../elems/events';
import { mergeRendered } from '../elems/rendered';

/**
 * Add events to a Component
 */
export function we<C>(comp: Component<C>, events: Events): Component<C> {
    return (dom, ctxt) => {
        const r = comp(dom, ctxt)

        return mergeRendered(r.node, [
            r,
            withEvents(dom, r.node, events)
        ])
    }
}

/**
 * Setup `onClick` event handler to a component
 */
export function onClick<C>(comp: Component<C>, event: EventListener) {
    return we(comp, {
        click: event
    })
}