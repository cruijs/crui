import { Setup } from '@crui/core/dom';
import { defResult } from '@crui/core/dom/rendered';
import { css as renderCss, cx, Interpolation } from 'emotion';

export type CSS<MP> = Interpolation<MP>
/**
 * Setup CSS on an element
 */
export function css<M, S>(s: CSS<S>): Setup<{}, M> {
    return (meta, dom, node) => {
        const cs = dom.getCss(node)
        cs.push(renderCss(s as CSS<undefined>))
        dom.setProp(node, 'className', cx(...cs))

        return defResult(meta)
    }
}