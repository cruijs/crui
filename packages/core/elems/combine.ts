import { Component, Tag } from '../dom';
import { Setup } from '../dom/index';
import { mergeLifecycles } from '../dom/rendered';
import { modify } from '../utils/modify';

export type Combinator = <T extends Tag, C, D>(
    comp: Component<T, C>, setup: Setup<T, D>
) => Component<T, C & D>

export const ws: Combinator = (comp, setup) =>
    (dom, ctxt) => (
        modify(comp(dom, ctxt), (r) => {
            r.lfc = mergeLifecycles([
                r.lfc,
                setup(dom, r.node, ctxt)
            ])
        })
    )