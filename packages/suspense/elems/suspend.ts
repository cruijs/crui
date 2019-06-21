import { Component } from '@crui/core/dom';
import { WithSuspense } from '../context';
import { Suspender } from '../suspender';
import { proxyNode, replace } from '../utils';

export function suspend<C, E = void>(
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
    return proxyNode(rz)

}