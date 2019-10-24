import { Interpolation } from 'emotion'
import { Action, AnyAction, Driver } from '../../types'
import { action } from '../action'
import { TagR } from '../../retrictions/tag'

export const CssType = Symbol('css')
export type CssDriver<N = any, S extends AnyAction = AnyAction> = {
    [CssType]: Driver<N, Css, S>
}
export type Style<S> = Interpolation<S>
export type Css<S = undefined> = Action<typeof CssType, CssDriver, TagR> & {
    style: Style<S>
}

export function css<S>(style: Style<S>): Css<S> {
    return action({
        type: CssType,
        style,
    })
}