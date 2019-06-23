import { AsyncFn, Unsubscribe } from '../types';
import { Rendered, SetupR } from './rendered';
import { Style } from './style';

export * from '../types';

export type Component<C = {}, M = {}> = <N>(dom: DOM<N>, context: C) => Rendered<N, M>

export type Setup<C = {}, M = {}> = <N>(
    meta: M, dom: DOM<N>, node: N, ctxt: C
) => SetupR<M>

type Props = { [key: string]: PropVal } 
type PropVal = string|number|boolean|null

export interface DOM<N> {
    create(tag: string): N
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

    setProps(node: N, props: Props): N
    setProp(node: N, prop: string, value: PropVal): N
    getProp(node: N, prop: string): PropVal

    runOnNextFrame(f: AsyncFn): PromiseLike<void>
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