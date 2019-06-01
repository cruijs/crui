import { Component, DOM, Tag } from '@crui/core/dom';
import { defRendered, modRendered, Rendered } from '@crui/core/dom/rendered';
import { combine, combine2 } from '@crui/core/utils/combine';
import { addClass } from '@crui/css-emotion/elems/css';
import { StreamBox } from '@crui/reactive/rx/box';
import { css, Interpolation } from 'emotion';

export type $CSS<MP> = ReadonlyArray<{
    cond: StreamBox<boolean>
    style: Interpolation<MP>
}>

/**
 * An element with conditionally added / removed CSS classes.
 * Please be aware that:
 * - styles in later classes have an higher priority
 * - all `cond` streams will be destroyed once Component is removed
 */
export function h$ss<M>(tag: Tag, style: $CSS<M>): Component<any> {
    return (dom) => {
        const node = dom.create(tag)
        return with$CSS(dom, node, style)
    }
}

export const style = <M>(cond: StreamBox<boolean>, style: Interpolation<M>) => ({
    cond, style
})

export function with$CSS<N, M>(dom: DOM<N>, node: N, style?: $CSS<M>): Rendered<N> {
    return style == null ? defRendered(node) : modRendered(node, (m) => {
        const unsub = combine(
            style.map(({ style, cond }) => {
                const klass = css(style as Interpolation<undefined>)

                cond.apply((shouldAdd) => {
                    if (shouldAdd)
                        addClass(dom, node, klass)
                    else
                        dom.removeCss(node, klass)
                })
                return cond.destroy
            })
        )
        m.unsub = combine2(m.unsub, unsub)
    })
}