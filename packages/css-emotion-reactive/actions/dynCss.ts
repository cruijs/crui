import { Action, Driver, SetupAction, TagR } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { CssStyle } from '@crui/css-emotion'
import { DR$B } from '@crui/reactive/rx/box'

export const DynCssType = Symbol('dyncss')
export type DynCssDriver<N = any, S extends Action = never> = {
    [DynCssType]: Driver<N, DynCss, S>
}
export type $Style<S = undefined> = DR$B<CssStyle<S>>
export type DynCss<S = undefined> = SetupAction<typeof DynCssType, DynCssDriver, TagR> & {
    stream: $Style<S>
}

export function dynCss<S>(stream: $Style<S>): DynCss<S> {
    return action({
        type: DynCssType,
        stream,
    })
}