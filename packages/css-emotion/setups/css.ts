import { Meta, Setup, Tag } from '@crui/core/dom';
import { defResult } from '@crui/core/dom/rendered';
import { css as renderCss, cx, Interpolation, ClassNamesArg } from 'emotion';

type CSS<MP> = Interpolation<MP>
export type CSSMeta<T> = Meta<T> & {
    classes?: ClassNamesArg[]
}
/**
 * Setup CSS on an element
 */
export function css<S, T extends Tag>(s: CSS<S>): Setup<{}, CSSMeta<T>> {
    return (meta, dom, node) => {
        const cs: ClassNamesArg[] = meta.classes || []
        cs.push(renderCss(s as CSS<undefined>))
        meta.classes = cs

        dom.setProp(node, 'className', cx(...cs))

        return defResult(meta)
    }
}