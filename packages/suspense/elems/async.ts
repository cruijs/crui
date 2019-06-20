import { Component, AnyTag } from '@crui/core/dom';
import { empty } from '@crui/core/elems/elem';
import { WithSuspense } from '../context';
import { proxy, replace } from '../utils';

export function wAsync<T extends AnyTag, V, C>(
    p: PromiseLike<V>,
    comp: (s: V) => Component<T, C>
): Component<T, C & WithSuspense> {
    return (dom, ctxt) => {
        const rn = empty(dom, ctxt)
        
        ctxt.waitFor(p.then((val) => {
            replace(dom, rn, comp(val)(dom, ctxt))
        }))

        return proxy(rn)
    }
}