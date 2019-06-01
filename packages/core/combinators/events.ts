import { Component } from '../dom/index';
import { Events, withEvents } from '../elems/events';
import { combinator } from './combinator';

/**
 * Add events to a Component
 */
export function we<C>(comp: Component<C>, events: Events): Component<C> {
    return combinator(comp, (dom, node) =>
        withEvents(dom, node, events)
    )
}

/**
 * Setup `onClick` event handler to a component
 */
export function onClick<C>(comp: Component<C>, event: EventListener) {
    return we(comp, {
        click: event
    })
}