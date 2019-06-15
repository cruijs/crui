import { Component } from '@crui/core/dom'
import { empty } from '@crui/core/elems/empty';
import { WithSuspense } from '../context';
import { proxy, replace } from '../utils';

export function wAsync<T, C>(
    p: PromiseLike<T>,
    comp: (s: T) => Component<C>
): Component<C & WithSuspense> {
    return (dom, ctxt) => {
        const rn = empty(dom, ctxt)
        
        ctxt.waitFor(p.then((val) => {
            replace(dom, rn, comp(val)(dom, ctxt))
        }))

        return proxy(rn)
    }
}