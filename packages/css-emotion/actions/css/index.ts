import { Action, Driver, SetupAction, TagR } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { Interpolation } from 'emotion'

export const CssType = Symbol('css')
export type CssDriver<N = any, S extends Action = never> = {
    [CssType]: Driver<N, Css, S>
}
export type Style<S> = Interpolation<S>
export type Css<S = undefined> = SetupAction<typeof CssType, CssDriver, TagR> & {
    style: Style<S>
}

export function css<S>(style: Style<S>): Css<S> {
    return action({
        type: CssType,
        style,
    })
}