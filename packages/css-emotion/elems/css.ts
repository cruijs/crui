import { Component, DOM, Tag } from '@crui/core/dom';
import { defRendered } from '@crui/core/dom/rendered';
import { css, cx, Interpolation } from 'emotion';

export type CSS<MP> = Interpolation<MP>
/**
 * An element with CSS
 */
export function hss<S>(tag: Tag, style: CSS<S>): Component<any> {
    return (dom) => {
        const r = defRendered(dom.create(tag))
        withCSS(dom, r.node, style)
        return r
    }
}

/**
 * Add CSS for a node. It properly handles nodes that already have a className
 */
export function withCSS<N, S>(dom: DOM<N>, node: N, style: CSS<S>): void {
    addClass(dom, node, css(style as CSS<undefined>))
}

export function addClass<N>(dom: DOM<N>, node: N, klass: string): void {
    const cs = dom.getCss(node)
    cs.push(klass)
    dom.setProp(node, 'className', cx(...cs))
}