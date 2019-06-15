import { Component, DOM } from '../dom';
import { mergeRendered, Rendered } from '../dom/rendered';

export type Enhance<C = {}> = <N>(dom: DOM<N>, node: N, ctxt: C) => Rendered<N>
export type Combinator = <C, D>(comp: Component<C>, enhance: Enhance<D>) => Component<C & D>
export const combinator: Combinator = (comp, enhance) =>
    (dom, ctxt) => {
        const r = comp(dom, ctxt)
        return mergeRendered(r.node, [
            r,
            enhance(dom, r.node, ctxt)
        ])
    }