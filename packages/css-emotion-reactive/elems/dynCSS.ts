import { Component, DOM, Tag } from '@crui/core/dom';
import { modRendered, Rendered } from '@crui/core/dom/rendered';
import { css, Style } from '@crui/css-emotion';
import { StreamBox } from '@crui/reactive/rx/box';
import { combine } from '@crui/core/utils/combine'

export type DynCSS = StreamBox<Style>[]
export function h$dss<C>(tag: Tag, styles: DynCSS): Component<C> {
    return (dom) => {
        const node = dom.create(tag)
        return with$DynCSS(dom, node, styles)
    }
}

export function with$DynCSS<N>(dom: DOM<N>, node: N, styles?: DynCSS): Rendered<N> {
    return modRendered(node, (r) => {
        if (styles == null)
            return

        r.unsub = combine(styles.map((s) => {
            let prev = ''
            s.apply((style) => {
                const cur = css(style)
                dom.removeCss(node, prev)
                dom.addCss(node, cur)
                prev = cur
            })
            return s.destroy
        }))
    })
}