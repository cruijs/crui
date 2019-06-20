import { DOM, Setup } from '../../dom';
import { Lifecycle, mergeLifecycles, rendered, Rendered } from '../../dom/rendered';

export function configure<N, C, M0, M1>(dom: DOM<N>, ctxt: C, setups: Setup<C, M0, M1>[], node: N, meta: M0): Rendered<N, M1> {
    const lfcs = Array(setups.length) as Lifecycle[]
    const result = setups.reduce(
        (z, setup) => {
            const r = setup(z.meta, dom, node, ctxt)
            z.lfcs.push(r.lfc)
            z.meta = r.meta
            return z
        },
        { lfcs, meta: (meta as any) }
    )
    return rendered(node, mergeLifecycles(result.lfcs), result.meta as M1)
}