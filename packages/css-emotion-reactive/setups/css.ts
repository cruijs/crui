import { Setup } from '@crui/core/dom';
import { modLifecycle, result } from '@crui/core/dom/rendered';
import { combine } from '@crui/core/utils/combine';
import { apply, Cond$B } from '@crui/reactive/rx/box';
import { css, Interpolation } from 'emotion';

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
export function $css<M, S>(style: $CSS<S>): Setup<{}, M> {
    return (meta, dom, node) => result(
        meta,
        modLifecycle((m) => {
            m.unsub = combine(
                style.map(({ style, cond }) => {
                    const klass = css(style as Interpolation<undefined>)

                    apply(cond, (shouldAdd) => {
                        if (shouldAdd)
                            dom.addCss(node, klass)
                        else
                            dom.removeCss(node, klass)
                    })
                    return cond.destroy
                })
            )
        })
    )
}