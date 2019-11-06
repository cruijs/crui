import { MockNode } from '../../tests/mockNode'
import { EventDriver, EventType } from './index'

export const eventDriver: EventDriver<MockNode> = {
    [EventType]: (node, { event, handler }) => {
        const es = node.events[event] || []
        node.events[event] = es
        es.push(handler)
    }
}