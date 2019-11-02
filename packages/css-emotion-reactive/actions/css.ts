import { Action, Driver, SetupAction, TagR } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { CssStyle } from '@crui/css-emotion'
import { Cond$B } from '@crui/reactive/rx/box'

export const $CssType = Symbol('$css')
export type $CssDriver<N = any, S extends Action = never> = {
    [$CssType]: Driver<N, $Css, S>
}
export type $Css<S = undefined> = SetupAction<typeof $CssType, $CssDriver, TagR> & {
    when: Cond$B,
    style: CssStyle<S>
}

export function $css<S>(when: Cond$B, style: CssStyle<S>): $Css<S> {
    return action({
        type: $CssType,
        when,
        style,
    })
}