import { AsyncFn, BoundingRect, DOM, Listen, Props, PropVal, Unsubscribe } from '@crui/core/dom';
import { KS, PS, Style } from '@crui/core/dom/style';
import { remove } from '@crui/core/utils/array';
import { Fn0, runAll } from '@crui/core/utils/combine';

export function enhanceDom<N>(dom: DOM<N>): DomChangeDetector<N> {
    return (dom instanceof DomChangeDetector)
        ? dom : new DomChangeDetector(dom)
}

export class DomChangeDetector<N> implements DOM<N> {
    private readonly dom: DOM<N>
    private listeners: Fn0[]
    private scheduled: boolean

    constructor(dom: DOM<N>) {
        this.dom = dom
        this.listeners = []
        this.scheduled = false
    }

    onChange(f: Fn0): Unsubscribe {
        this.listeners.push(f)
        return () => {
            remove(this.listeners, f)
        }
    }

    private schedule(): void {
        if (this.scheduled)
            return

        this.scheduled = true
        this.dom.runOnNextFrame(() => {
            this.scheduled = false
            runAll(this.listeners.slice())
        })
    }

    createText(s: string): N {
        this.schedule()
        return this.dom.createText(s)
    }
    setText(n: N, s: string): N {
        this.schedule()
        return this.dom.setText(n, s)
    }

    create(tag: string): N {
        this.schedule()
        return this.dom.create(tag)
    }
    replace(old: N, rpl: N): void {
        this.schedule()
        this.dom.replace(old, rpl)
    }
    remove(parent: N, child: N): void {
        this.schedule()
        this.dom.remove(parent, child)
    }
    insert(parent: N, child: N): void {
        this.schedule()
        this.dom.insert(parent, child)
    }
    insertBefore(parent: N, ref: N | null, node: N): void {
        this.schedule()
        this.dom.insertBefore(parent, ref, node)
    }
    batchInsert(parent: N, children: N[]): void {
        this.schedule()
        this.dom.batchInsert(parent, children)
    }
    batchInsertBefore(parent: N, ref: N | null, node: N[]): void {
        this.schedule()
        this.dom.batchInsertBefore(parent, ref, node)
    }
    nextChild(parent: N, ref: N): N | null {
        return this.dom.nextChild(parent, ref)
    }
    listen: Listen<N> = (n, e, h) => {
        return this.dom.listen(n, e, h)
    }
    applyStyle<S extends KS>(node: N, style: PS<S>): N {
        this.schedule()
        return this.dom.applyStyle(node, style)
    }
    modStyle(node: N, f: (style: Style) => void): N {
        this.schedule()
        return this.dom.modStyle(node, f)
    }
    getCss(node: N): string[] {
        return this.dom.getCss(node)
    }
    addCss(node: N, klass: string): N {
        this.schedule()
        return this.dom.addCss(node, klass)
    }
    removeCss(node: N, klass: string): N {
        this.schedule()
        return this.dom.removeCss(node, klass)
    }
    setProps(node: N, props: Props): N {
        this.schedule()
        return this.dom.setProps(node, props)
    }
    setProp(node: N, prop: string, value: PropVal): N {
        this.schedule()
        return this.dom.setProp(node, prop, value)
    }
    getProp(node: N, prop: string): PropVal {
        return this.dom.getProp(node, prop)
    }
    setFocus(node: N): N {
        return this.dom.setFocus(node)
    }
    runOnNextFrame(f: AsyncFn | Fn0): PromiseLike<void> {
        return this.dom.runOnNextFrame(f)
    }
    onWindowResize(f: Fn0): Unsubscribe {
        return this.dom.onWindowResize(f)
    }
    measure(node: N): BoundingRect {
        return this.dom.measure(node)
    }
}