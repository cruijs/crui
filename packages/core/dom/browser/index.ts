import { assign } from '../../utils/object';
import { Component, DOM, Listen, render } from '../index';

const listen: Listen<Node> = (elem, event, handler) => {
    elem.addEventListener(event, handler)
    return () => elem.removeEventListener(event, handler)
}

let fragment: DocumentFragment|undefined
const withFragment = (ns: Node[]) => {
    if (!fragment) {
        fragment = document.createDocumentFragment()
    }
    ns.forEach((n) => fragment!.appendChild(n))
    return fragment
}

export function mount<Ctxt extends C, C>(root: Node, comp: Component<C>, context: Ctxt) {
    const r = render(dom, root, comp, context)
    window.requestAnimationFrame(r.lfc.onMounted)
    return r
}

export const dom: DOM<Node> = {
    create: (tag) => document.createElement(tag),
    createText: (s: string) => document.createTextNode(s),
    createFragment: () => document.createDocumentFragment(),

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
    }
}