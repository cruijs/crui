import { Cleanup, Rendered } from '../elems/rendered';
import { Unsubscribe } from '../type';

export type Tag = string
export type Node = {}
export type Component = <N extends Node>(dom: DOM<N>) => Rendered<N>

export type DOM<N extends Node = any> = {
    create: (tag: Tag) => N
    createText: (s: string) => N & { textContent: string|null }
    remove: (parent: N, child: N) => void
    insert: (parent: N, child: N) => void
    insertBefore: (parent: N, ref: N|null, node: N) => void
    batchInsert: (parent: N, children: N[]) => void
    batchInsertBefore: (parent: N, ref: N|null, node: N[]) => void
    nextChild: (parent: N, ref: N) => N|null
    listen: Listen<N>
}

export function render<N extends Node>(
    dom: DOM<N>,
    root: N,
    comp: Component,
): Cleanup {
    const r = comp(dom)
    dom.insert(root, r.node)
    return r
}

export type Listen<N extends Node> = (
    node: N,
    event: string,
    handler: (e: Event) => void
) => Unsubscribe