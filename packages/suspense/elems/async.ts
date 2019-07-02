import { Component } from '@crui/core/dom';
import { empty } from '@crui/core/elems/empty';
import { WithSuspense } from '../context';
import { proxyNode, replace } from '../utils';

export function hAsync<T, C>(
    p: PromiseLike<T>,
    comp: (s: T) => Component<C, any>
): Component<C & WithSuspense, {}> {
    return (dom, ctxt) => {
        const rn = empty(dom, ctxt)
        
        ctxt.waitFor(p.then((val) => {
            return replace(dom, rn, comp(val)(dom, ctxt))
        }))

        return proxyNode(rn)
    }
}