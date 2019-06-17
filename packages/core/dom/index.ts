import { Rendered, Lifecycle } from './rendered';
import { AsyncFn, Unsubscribe, Tag, Node } from '../types';
import { KProps, PProps, Props } from './props';
import { Style } from './style';

export { Tag } from '../types'

export type Component<T extends Tag, C = {}> = <N extends Node<T>>(dom: DOM<N>, context: C) => Rendered<N>

export type Setup<T extends Tag = Tag, C = {}> = <N extends Node<T>>(
    dom: DOM<N>, node: N, ctxt: C
) => Lifecycle

export interface DOM<N> {
    create(tag: Tag): N
    createText(s: string): N & { textContent: string|null }
    createFragment(): N

    replace(old: N, rpl: N): void
    remove(parent: N, child: N): void
    insert(parent: N, child: N): void
    insertBefore(parent: N, ref: N|null, node: N): void
    batchInsert(parent: N, children: N[]): void
    batchInsertBefore(parent: N, ref: N|null, node: N[]): void
    nextChild(parent: N, ref: N): N|null

    listen: Listen<N>

    applyStyle<S extends keyof Style>(node: N, style: Pick<Style, S>): N
    modStyle(node: N, f: (style: Style) => void): N
    getCss(node: N): string[]
    addCss(node: N, klass: string): N
    removeCss(node: N, klass: string): N

    setProps<K extends KProps>(node: N, props: PProps<K>): N
    setProp<K extends KProps>(node: N, prop: K, value: Props[K]): N
    getProp<K extends KProps>(node: N, prop: K): Props[K]

    runOnNextFrame(f: AsyncFn): PromiseLike<void>
}

export function render<T extends Tag, N extends Node<T>, Ctxt extends C, C>(
    dom: DOM<N>,
    root: N,
    comp: Component<T, C>,
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