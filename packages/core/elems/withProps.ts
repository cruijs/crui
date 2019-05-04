import { Component, Tag } from '../dom/index';
import { keys } from '../utils/object';
import { defCleanup } from './rendered';

export function hp<P>(tag: Tag, props: P): Component {
    return (dom) => {
        const node = dom.create(tag)
        withProps(props)

        return {
            ...defCleanup,
            node
        }
    }
}

export function withProps<N, P extends keyof N>(node: N, props?: { [K in P]: N[P] }): void {
    if (props != null) {
        for (const k of keys(props)) {
            node[k] = props[k]
        }
    }
}