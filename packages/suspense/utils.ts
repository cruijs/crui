import { DOM } from '@crui/core/dom';
import { Rendered } from '@crui/core/dom/rendered';

export function replace<N>(dom: DOM<N>, rold: Rendered<N>, rnew: Rendered<N>): PromiseLike<void> {
    return rold.onUnmount().then(() => {
        dom.replace(rold.node, rnew.node)
        rold.unsub()
        Object.assign(rold, rnew)

        return rnew.onMounted()
    })
}

export function proxy<N>(r: Rendered<N>): Rendered<N> {
    return {
        get node() { return r.node },
        onMounted: () => r.onMounted(),
        onUnmount: () => r.onUnmount(),
        unsub: () => r.unsub()
    }
}