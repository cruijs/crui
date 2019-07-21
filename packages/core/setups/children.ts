import { Component, Setup } from '../dom';
import { defResult, mergeLifecycles, result } from '../dom/rendered';

/**
 * Append children to a node
 */
export function children<C0, M>(cs: [Component<C0, any>]): Setup<C0, M>
export function children<C0, C1, M>(cs: [Component<C0, any>, Component<C1, any>]): Setup<C0 & C1, M>
export function children<C0, C1, C2, M>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>]): Setup<C0 & C1 & C2, M>
export function children<C0, C1, C2, C3, M>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>]): Setup<C0 & C1 & C2 & C3, M>
export function children<C0, C1, C2, C3, C4, M>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>]): Setup<C0 & C1 & C2 & C3 & C4, M>
export function children<C0, C1, C2, C3, C4, C5, M>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>]): Setup<C0 & C1 & C2 & C3 & C4 & C5, M>
export function children<C0, C1, C2, C3, C4, C5, C6, M>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>]): Setup<C0 & C1 & C2 & C3 & C4 & C5 & C6, M>
export function children<C0, C1, C2, C3, C4, C5, C6, C7, M>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>]): Setup<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7, M>
export function children<C0, C1, C2, C3, C4, C5, C6, C7, C8, M>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>, Component<C8, any>]): Setup<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8, M>
export function children<C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, M>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>, Component<C8, any>, Component<C9, any>]): Setup<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9, M>
export function children<C, M>(cs: Component<C, any>[]): Setup<C, M>
export function children<C, M>(cs: Component<C, any>[]): Setup<C, M> {
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

export function child<C, M>(c: Component<C, any>): Setup<C, M> {
    return children([c])
}