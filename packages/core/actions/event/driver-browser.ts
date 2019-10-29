import { EventDriver, EventType } from './index'

export const eventDriver: EventDriver<Element> = {
    [EventType]: (node, { event, handler }) => {
        node.addEventListener(event, handler)
    }
}