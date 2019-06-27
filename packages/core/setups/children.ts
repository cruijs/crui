import { Component, Setup } from '../dom';
import { defResult, mergeLifecycles, result } from '../dom/rendered';

/**
 * Append children to a node
 */
export function children<C0>(cs: [Component<C0, any>]): Setup<C0>
export function children<C0, C1>(cs: [Component<C0, any>, Component<C1, any>]): Setup<C0 & C1>
export function children<C0, C1, C2>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>]): Setup<C0 & C1 & C2>
export function children<C0, C1, C2, C3>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>]): Setup<C0 & C1 & C2 & C3>
export function children<C0, C1, C2, C3, C4>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>]): Setup<C0 & C1 & C2 & C3 & C4>
export function children<C0, C1, C2, C3, C4, C5>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>]): Setup<C0 & C1 & C2 & C3 & C4 & C5>
export function children<C0, C1, C2, C3, C4, C5, C6>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>]): Setup<C0 &C1 & C2 & C3 & C4 & C5 & C6>
export function children<C0, C1, C2, C3, C4, C5, C6, C7>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>]): Setup<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7>
export function children<C0, C1, C2, C3, C4, C5, C6, C7, C8>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>, Component<C8, any>]): Setup<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8>
export function children<C0, C1, C2, C3, C4, C5, C6, C7, C8, C9>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>, Component<C8, any>, Component<C9, any>]): Setup<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9>
export function children<C>(cs: Component<C, any>[]): Setup<C>
export function children<C>(cs: Component<C, any>[]): Setup<C> {
    return (meta, dom, parent, ctxt) => {
        if (cs.length === 0) {
            return defResult(meta)
        }

        return result(meta, mergeLifecycles(
            cs.map((render) => {
                const r = render(dom, ctxt)
                dom.insert(parent, r.node)
                return r.lfc
            })
        ))
    }
}

export function child<C>(c: Component<C, any>): Setup<C> {
    return children([c])
}