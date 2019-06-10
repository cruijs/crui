import { Component, DOM } from '@crui/core/dom';
import { Rendered } from '@crui/core/dom/rendered';
import { WithSuspense } from '../context';
import { Suspender } from '../suspender'

export function suspend<C, E>(
    loader: Component<C>,
    comp: Component<C & WithSuspense>,
    error: (err: E) => Component<C>
): Component<C> {
    return withSuspender(new Suspender(), loader, comp, error)
}

export const withSuspender = <C, E>(
    suspender: Suspender,
    loader: Component<C>,
    comp: Component<C & WithSuspense>,
    error: (err: E) => Component<C>
): Component<C> => (dom, ctxt) => {
    const rc = comp(dom, {
        ...ctxt,
        waitFor: suspender.waitFor
    })

    if (suspender.nothingToWaitFor()) {
        return rc
    }

    const rz = loader(dom, ctxt)
    suspender.waitAll().then(
        () => replace(dom, rz, rc),
        (err) => replace(dom, rz, error(err)(dom, ctxt))
    )
    return proxy(rz)

}

function replace<N>( dom: DOM<N>, rold: Rendered<N>, rnew: Rendered<N>): PromiseLike<void> {
    return rold.onUnmount().then(() => {
        dom.replace(rold.node, rnew.node)
        rold.unsub()
        Object.assign(rold, rnew)

        return rnew.onMounted()
    })
}

function proxy<N>(r: Rendered<N>): Rendered<N> {
    return {
        get node() { return r.node },
        onMounted: () => r.onMounted(),
        onUnmount: () => r.onUnmount(),
        unsub: () => r.unsub()
    }
}