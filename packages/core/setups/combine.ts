import { Setup } from '../dom/index';
import { mergeLifecycles, result } from '../dom/rendered';
/**
 * SetupCombine2
 * Combine 2 setups into one
 */
export function sc2<C, D, M>(a: Setup<C, M>, b: Setup<D, M>): Setup<C & D, M> {
    return (meta, dom, node, ctxt) => {
        const ra = a(meta, dom, node, ctxt)
        const rb = b(ra.meta, dom, node, ctxt)
        return result(rb.meta, mergeLifecycles([ra.lfc, rb.lfc]))
    }
}