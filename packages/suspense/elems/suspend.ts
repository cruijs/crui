import { Component } from '@crui/core/dom';
import { WithSuspense } from '../context'
import { Suspender } from '../suspender';
import { proxyNode, replace } from '../utils';

type ReadyComponent<C> = C extends WithSuspense ? never : Component<C>
export function suspend<A, B, C, E = void>(
    loader: ReadyComponent<A>,
    comp: Component<B & WithSuspense>,
    error: (err: E) => ReadyComponent<C>
): Component<A & B & C> {
    return withSuspender(new Suspender(), loader, comp, error)
}

export const withSuspender = <A, B, C, E>(
    suspender: Suspender,
    loader: ReadyComponent<A>,
    comp: Component<B & WithSuspense>,
    error: (err: E) => ReadyComponent<C>
): Component<A & B & C> => (dom, ctxt) => {
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