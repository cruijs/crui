import { Setup } from '../../dom/index';
import { Lifecycle, mergeLifecycles, result } from '../../dom/rendered';

export function sc<C0, C1, M>(setups: [Setup<C0, M>]): Setup<C0, M>
export function sc<C0, C1, C2, M>(setups: [Setup<C0, M>, Setup<C1, M>]): Setup<C0 & C1, M>
export function sc<C0, C1, C2, C3, M>(setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>]): Setup<C0 & C1 & C2, M>
export function sc<C0, C1, C2, C3, C4, M>(setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>]): Setup<C0 & C1 & C2 & C3, M>
export function sc<C0, C1, C2, C3, C4, C5, M>(setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>]): Setup<C0 & C1 & C2 & C3 & C4, M>
export function sc<C0, C1, C2, C3, C4, C5, C6, M>(setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>, Setup<C5, M>]): Setup<C0 & C1 & C2 & C3 & C4 & C5, M>
export function sc<C0, C1, C2, C3, C4, C5, C6, C7, M>(setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>, Setup<C5, M>, Setup<C6, M>]): Setup<C0 & C1 & C2 & C3 & C4 & C5 & C6, M>
export function sc<C0, C1, C2, C3, C4, C5, C6, C7, C8, M>(setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>, Setup<C5, M>, Setup<C6, M>, Setup<C7, M>]): Setup<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7, M>
export function sc<C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, M>(setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>, Setup<C5, M>, Setup<C6, M>, Setup<C7, M>, Setup<C8, M>]): Setup<C0 & C1 & C2 & C3 & C4 & C5 & C6 &C7 & C8, M>
export function sc<C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, M>(setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>, Setup<C5, M>,Setup<C6, M>, Setup<C7, M>, Setup<C8, M>, Setup<C9, M>]): Setup<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9, M>
export function sc<C, M>(setups: Setup<C, M>[]): Setup<C, M>
export function sc<C, M>(setups: Setup<C, M>[]): Setup<C, M> {
    return (meta, dom, node, ctxt) => {
        const lfcs = Array(setups.length) as Lifecycle[]
        const r = setups.reduce(
            (z, setup) => {
                const r = setup(z.meta, dom, node, ctxt)
                z.lfcs.push(r.lfc)
                z.meta = r.meta
                return z
            },
            { lfcs, meta }
        )
        return result(r.meta, mergeLifecycles(r.lfcs))
    }
}