import { Component, DOM, Tag } from '@crui/core/dom';
import { defRendered } from '@crui/core/elems/rendered';
import { css, cx, Interpolation } from 'emotion';

export type CSS<MP> = Interpolation<MP>
export function hss<C, S>(tag: Tag, style: CSS<S>): Component<C> {
    return (dom) => {
        const r = defRendered(dom.create(tag))
        withCSS(dom, r.node, style)
        return r
    }
}

export function withCSS<N, S>(dom: DOM<N>, node: N, style: CSS<S>): void {
    const cs = dom.getCss(node)
    cs.push(
        css(style as CSS<undefined>)
    )
    dom.setProp(node, 'className', cx(...cs))
}