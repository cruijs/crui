import { Tag, Component } from '../dom/index'
import { defCleanup } from './rendered'

export function e(tag: Tag): Component {
    return (dom) => {
        const node = dom.create(tag)
        return {
            node,
            unsub: defCleanup.unsub,
            beforeUnmount: defCleanup.beforeUnmount
        }
    }
}