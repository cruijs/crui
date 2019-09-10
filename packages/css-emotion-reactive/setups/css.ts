import { Setup, Tag } from '@crui/core/dom';
import { modLifecycle, result } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { apply, Cond$B } from '@crui/reactive/rx/box';
import { css, Interpolation, ClassNamesArg, cx } from 'emotion';
import { CSSMeta } from '@crui/css-emotion/setups/css';

export type $CSS<MP> = ReadonlyArray<{
    cond: Cond$B
    style: Interpolation<MP>
}>

/**
 * An element with conditionally added / removed CSS classes.
 * Please be aware that:
 * - styles in later classes have an higher priority
 * - all `cond` streams will be destroyed once Component is removed
 */
export function $css<S, T extends Tag>(style: $CSS<S>): Setup<{}, CSSMeta<T>> {
    return (meta, dom, node) => result(
        meta,
        modLifecycle((m) => {
            m.unsub = combine(
                style.map(({ style, cond }) => {
                    const cs: ClassNamesArg[] = meta.classes || []
                    const klass = css(style as Interpolation<undefined>)
                    const obj = {[klass]: false}
                    cs.push(obj)
                    meta.classes = cs

                    apply(cond, (shouldAdd) => {
                        obj[klass] = shouldAdd
                        dom.setProp(node, 'className', cx(...cs))
                    })

                    return cond.destroy
                })
            )
        })
    )
}