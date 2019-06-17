import { Component, Setup } from '@crui/core/dom';
import { empty } from '@crui/core/elems/empty';
import { WithSuspense } from '../context';
import { proxy, replace } from '../utils';
import { result } from '@crui/core/dom/rendered';

export function wAsync<T, C>(
    p: PromiseLike<T>,
    comp: (s: T) => Component<C, any>
): Setup<C & WithSuspense, {}> {
    return (meta, dom, node, ctxt) => {
        const r = empty(dom, ctxt)
        
        ctxt.waitFor(p.then((val) => {
            replace(dom, r, comp(val)(dom, ctxt))
        }))

        dom.insert(node, r.node)

        return result(meta, proxy(r))
    }
}