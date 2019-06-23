import { DOM, Setup } from '../../dom';
import { Lifecycle, mergeLifecycles, rendered, Rendered } from '../../dom/rendered';

export function configure<N, C, M>(dom: DOM<N>, ctxt: C, setups: Setup<C, M>[], node: N, meta: M): Rendered<N, M> {
    const lfcs = Array(setups.length) as Lifecycle[]
    const result = setups.reduce(
        (z, setup) => {
            const r = setup(z.meta, dom, node, ctxt)
            z.lfcs.push(r.lfc)
            z.meta = r.meta
            return z
        },
        { lfcs, meta }
    )
    return rendered(node, mergeLifecycles(result.lfcs), result.meta)
}