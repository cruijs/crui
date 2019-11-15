import { Action, Driver, SetupAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { Interpolation } from 'emotion'

export const CssType = Symbol('css')
export type CssDriver<N = any, S extends Action = never> = {
    [CssType]: Driver<N, Css, S>
}
export type CssStyle<S = undefined> = Interpolation<S>
export type Css<S = undefined> = SetupAction<typeof CssType, CssDriver> & {
    style: CssStyle<S>
}

export function css<S>(style: CssStyle<S>): Css<S> {
    return action({
        type: CssType,
        style,
    })
}