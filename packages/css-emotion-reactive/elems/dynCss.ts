import { Setup, Tag } from '@crui/core/dom';
import { modLifecycle } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { css, Style } from '@crui/css-emotion';
import { apply, DR$B } from '@crui/reactive/rx/box';

export type DynCSS = DR$B<Style>[]
/**
 * Setup an element with a Stream of Dynamic CSS
 */
export function $dss<T extends Tag>(styles: DynCSS): Setup<T> {
    return (dom, node) => modLifecycle((r) => {
        r.unsub = combine(styles.map((s) => {
            let prev: string|undefined
            apply(s, (style) => {
                const cur = css(style)
                if(prev) dom.removeCss(node, prev)
                dom.addCss(node, cur)
                prev = cur
            })
            return s.destroy
        }))
    })
}