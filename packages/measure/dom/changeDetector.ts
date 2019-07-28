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

    createText(s: string) {
        this.schedule()
        return this.dom.createText(s)
    }
    setText(n: N, s: string) {
        this.schedule()
        return this.dom.setText(n, s)
    }

    create(tag: string) {
        this.schedule()
        return this.dom.create(tag)
    }
    replace(old: N, rpl: N) {
        this.schedule()
        this.dom.replace(old, rpl)
    }
    remove(parent: N, child: N) {
        this.schedule()
        this.dom.remove(parent, child)
    }
    insert(parent: N, child: N) {
        this.schedule()
        this.dom.insert(parent, child)
    }
    insertBefore(parent: N, ref: N | null, node: N) {
        this.schedule()
        this.dom.insertBefore(parent, ref, node)
    }
    batchInsert(parent: N, children: N[]) {
        this.schedule()
        this.dom.batchInsert(parent, children)
    }
    batchInsertBefore(parent: N, ref: N | null, node: N[]) {
        this.schedule()
        this.dom.batchInsertBefore(parent, ref, node)
    }
    nextChild(parent: N, ref: N) {
        return this.dom.nextChild(parent, ref)
    }
    listen: Listen<N> = (n, e, h) => {
        return this.dom.listen(n, e, h)
    }
    applyStyle<S extends KS>(node: N, style: PS<S>) {
        this.schedule()
        return this.dom.applyStyle(node, style)
    }
    modStyle(node: N, f: (style: Style) => void) {
        this.schedule()
        return this.dom.modStyle(node, f)
    }
    getCss(node: N): string[] {
        return this.dom.getCss(node)
    }
    addCss(node: N, klass: string) {
        this.schedule()
        return this.dom.addCss(node, klass)
    }
    removeCss(node: N, klass: string) {
        this.schedule()
        return this.dom.removeCss(node, klass)
    }
    setProps(node: N, props: Props) {
        this.schedule()
        return this.dom.setProps(node, props)
    }
    setProp(node: N, prop: string, value: PropVal) {
        this.schedule()
        return this.dom.setProp(node, prop, value)
    }
    getProp(node: N, prop: string): PropVal {
        return this.dom.getProp(node, prop)
    }
    setAttribute(node: N, attr: string, val: string) {
        return this.dom.setAttribute(node, attr, val)
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