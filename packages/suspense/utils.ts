import { DOM } from '@crui/core/dom';
import { Rendered } from '@crui/core/dom/rendered';
import { Lifecycle } from '../core/dom/rendered';

export function replace<N>(dom: DOM<N>, rold: Rendered<N>, rnew: Rendered<N>): PromiseLike<void> {
    return rold.lfc.onUnmount().then(() => {
        dom.replace(rold.node, rnew.node)
        rold.lfc.unsub()
        Object.assign(rold, rnew)

        return rnew.lfc.onMounted()
    })
}

export function proxy<N>(r: Rendered<N>): Lifecycle {
    return {
        onMounted: () => r.lfc.onMounted(),
        onUnmount: () => r.lfc.onUnmount(),
        unsub: () => r.lfc.unsub()
    }
}

export function proxyNode<N>(r: Rendered<N>): Rendered<N> {
    return {
        meta: r.meta,
        lfc: proxy(r),
        get node() {
            return r.node
        }
    }
}