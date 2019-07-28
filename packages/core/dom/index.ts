import { AsyncFn, Meta, Tag, Unsubscribe } from '../types';
import { Fn0 } from '../utils/combine';
import { Rendered, SetupR } from './rendered';
import { Style } from './style';

export * from '../types';

export type Component<C = {}, M = Meta<Tag>> = <N>(dom: DOM<N>, context: C) => Rendered<N, M>

export type Setup<C, M> = <N>(
    meta: M, dom: DOM<N>, node: N, ctxt: C
) => SetupR<M>

export type Props = { [key: string]: PropVal } 
export type PropVal = string|number|boolean|null

export type Attributes = { [key: string]: string } 

export type BoundingRect = {
    top: number,
    bottom: number,
    left: number,
    right: number,
    width: number,
    height: number,
}

export interface DOM<N> {
    createText(s: string): N
    setText(node: N, s: string): N

    create(tag: string): N
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

    setProps(node: N, props: Props): N
    setProp(node: N, prop: string, value: PropVal): N
    getProp(node: N, prop: string): PropVal

    setAttribute(node: N, attr: string, value: string): N

    setFocus(node: N): N,

    runOnNextFrame(f: AsyncFn|Fn0): PromiseLike<void>

    onWindowResize(f: Fn0): Unsubscribe
    measure(node: N): BoundingRect
}

export function render<N, Ctxt extends C, C, M>(
    dom: DOM<N>,
    root: N,
    comp: Component<C, M>,
    context: Ctxt
): Rendered<N, M> {
    const r = comp(dom, context)
    dom.insert(root, r.node)
    return r
}

export type Listen<N> = (
    node: N,
    event: string,
    handler: (e: Event) => void
) => Unsubscribe