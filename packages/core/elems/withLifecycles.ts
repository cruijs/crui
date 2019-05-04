import { Component, Tag } from '../dom/index';
import { AsyncUnmount, Unsubscribe } from '../type';
import { Cleanup, defCleanup } from './rendered';

export type Lifecycle = {
    mounted?: <N>(node: N) => Unsubscribe
    willUnmount?: <N>(node: N) => AsyncUnmount
}

export function hlc(tag: Tag, lfc?: Lifecycle): Component {
    return (dom) => {
        const node = dom.create(tag)
        const { unsub, beforeUnmount } = withLifecycles(node, lfc)
        return { node, unsub, beforeUnmount }
    }
}

export function withLifecycles<N>(node: N, lfc?: Lifecycle): Cleanup {
    return lfc == null ? defCleanup : {
        unsub: lfc.mounted && lfc.mounted(node)
            || defCleanup.unsub,
        beforeUnmount: lfc.willUnmount && lfc.willUnmount(node)
            || defCleanup.beforeUnmount
    }
}