import { assign } from '../../utils/object';
import { BoundingRect, Component, DOM, Listen, render } from '../index';

interface WithHandler {
    addEventListener(event: string, handler: EventListener): void
    removeEventListener(event: string, handler: EventListener): void
}
const listen: Listen<WithHandler> = (elem, event, handler) => {
    elem.addEventListener(event, handler)
    return () => elem.removeEventListener(event, handler)
}

const noDim: BoundingRect = { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 }

function measure(node: HTMLElement): BoundingRect {
    const brect = node.getBoundingClientRect()
    return {
        top: brect.top + window.scrollY,
        left: brect.left + window.scrollX,
        bottom: brect.bottom + window.scrollY,
        right: brect.right + window.scrollX,
        width: brect.width,
        height: brect.height,
    }
}

let fragment: DocumentFragment|undefined
const withFragment = (ns: Node[]) => {
    if (!fragment) {
        fragment = document.createDocumentFragment()
    }
    ns.forEach((n) => fragment!.appendChild(n))
    return fragment
}

export function mount<Ctxt extends C, C>(root: Node, comp: Component<C, any>, context: Ctxt) {
    const r = render(dom, root, comp, context)
    window.requestAnimationFrame(r.lfc.onMounted)
    return r
}

export const dom: DOM<Node> = {
    createText: (s: string) => document.createTextNode(s),
    setText: (n, s) => {
        n.nodeValue = s
        return n
    },

    create: (tag) => document.createElement(tag),
    replace: (old, rpl) => {
        const p = old.parentElement
        if (p) p.replaceChild(rpl, old)
    },
    remove: (p, n) => {
        if (p === n.parentElement) {
            p.removeChild(n)
        }
    },

    insert: (p, n) => { p.appendChild(n) },
    insertBefore: (p, r, n) => (p).insertBefore(n, r),
    batchInsert: (p, ns) => { 
        p.appendChild(withFragment(ns)) 
    },
    batchInsertBefore: (p, r, ns) => {
        (p).insertBefore(withFragment(ns), r)
    },

    nextChild: (_, ref) => ref.nextSibling,
    listen,

    setProps: (node, props) => {
        if (node instanceof HTMLElement)
            assign(node, props)

        return node
    },
    setProp: (node, prop, val) => {
        if (node instanceof HTMLElement)
            (node as any)[prop] = val

        return node
    },
    getProp: (node, prop) => {
        if (node instanceof HTMLElement)
            return (node as any)[prop]

        throw new Error('Props can be retrieved only on HTMLElements')
    },

    setFocus: (node) => {
        if (node instanceof HTMLElement)
            node.focus()

        return node
    },

    applyStyle: (node, style) => {
        if (node instanceof HTMLElement)
            assign(node.style, style)

        return node
    },
    modStyle: (node, f) => {
        if (node instanceof HTMLElement)
            f(node.style as any)
        return node
    },
    getCss: (node) => Array.from(
        (node instanceof HTMLElement)
            ? node.classList.values()
            : []
    ),
    addCss: (node, klass) => {
        if (node instanceof HTMLElement)
            node.classList.add(klass)
        return node
    },
    removeCss: (node, klass) => {
        if (node instanceof HTMLElement)
            node.classList.remove(klass)
        return node
    },

    runOnNextFrame: (f) => {
        const nextFrame = new Promise((resolve) => {
            window.requestAnimationFrame(resolve)
        })
        return nextFrame.then(f)
    },

    onWindowResize: (f) => listen(window, 'resize', f),

    measure: (n) => (
        (n instanceof HTMLElement)
            ? measure(n)
            : noDim
    )
}