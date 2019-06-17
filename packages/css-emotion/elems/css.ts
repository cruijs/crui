import { Setup, Tag } from '@crui/core/dom';
import { defLifecycle } from '@crui/core/dom/rendered';
import { css, cx, Interpolation } from 'emotion';

export type CSS<MP> = Interpolation<MP>
/**
 * Setup CSS on an element
 */
export function style<T extends Tag, S>(s: CSS<S>): Setup<T> {
    return (dom, node) => {
        const cs = dom.getCss(node)
        cs.push(css(s as CSS<undefined>))
        dom.setProp(node, 'className', cx(...cs))

        return defLifecycle()
    }
}