import { Rendered } from '../elems/rendered';
import { Unsubscribe, AsyncFn } from '../type'
import { Style } from './style';

export type Tag = string
export type DOMNode = { style: Style } 
export type Component<C = {}> = <N>(dom: DOM<N>, context: C) => Rendered<N>

export interface DOM<N> {
    create: (tag: Tag) => N
    createText: (s: string) => N & { textContent: string|null }
    remove: (parent: N, child: N) => void
    insert: (parent: N, child: N) => void
    insertBefore: (parent: N, ref: N|null, node: N) => void
    batchInsert: (parent: N, children: N[]) => void
    batchInsertBefore: (parent: N, ref: N|null, node: N[]) => void
    nextChild: (parent: N, ref: N) => N|null
    listen: Listen<N>,
    applyStyle: (node: N, style: Style) => N
    runOnNextFrame: (f: AsyncFn) => PromiseLike<void>
}

export function render<N, Ctxt extends C, C>(
    dom: DOM<N>,
    root: N,
    comp: Component<C>,
    context: Ctxt
): Rendered<N> {
    const r = comp(dom, context)
    dom.insert(root, r.node)
    return r
}

export type Listen<N> = (
    node: N,
    event: string,
    handler: (e: Event) => void
) => Unsubscribe