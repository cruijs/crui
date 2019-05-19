import { DOM, Listen, render } from '..';
import { Component } from '../index';
import { keys } from '../../utils/object';

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
    window.requestAnimationFrame(r.onMounted)
    return r
}

export const dom: DOM<Node> = {
    create: (tag) => document.createElement(tag),
    createText: (s: string) => document.createTextNode(s),
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
    applyStyle: (node, style) => {
        if (node instanceof HTMLElement)
            keys(style).forEach((k) => {
                node.style[k] = style[k]
            })
        return node
    },
    runOnNextFrame: (f) => {
        const nextFrame = new Promise((resolve) => {
            window.requestAnimationFrame(resolve)
        })
        return nextFrame.then(f)
    }
}