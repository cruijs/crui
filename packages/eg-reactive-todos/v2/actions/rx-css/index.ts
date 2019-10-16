import { Cond$B } from '@crui/reactive/rx/box'
import { Action, AnyAction, Driver } from '../../types'
import { action } from '../action'
import { TagR } from '../tagAction'
import { Style } from '../css'

export const $CssType = Symbol('css')
export type $CssDriver<N = any, S extends AnyAction = AnyAction> = {
    [$CssType]: Driver<N, $Css, S>
}
export type $Css<S = undefined> = Action<typeof $CssType, $CssDriver, TagR> & {
    when: Cond$B,
    style: Style<S>
}

export function $css<S>(when: Cond$B, style: Style<S>): $Css<S> {
    return action({
        type: $CssType,
        when,
        style,
    })
}