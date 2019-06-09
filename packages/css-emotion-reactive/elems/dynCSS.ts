import { Component, DOM, Tag } from '@crui/core/dom';
import { modRendered, Rendered } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { css, Style } from '@crui/css-emotion';
import { DR$B } from '@crui/reactive/rx/box';

export type DynCSS = DR$B<Style>[]
export function h$dss(tag: Tag, styles: DynCSS): Component<any> {
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
            let prev: string|undefined
            s.apply((style) => {
                const cur = css(style)
                if(prev) dom.removeCss(node, prev)
                dom.addCss(node, cur)
                prev = cur
            })
            return s.destroy
        }))
    })
}