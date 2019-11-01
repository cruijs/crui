import { Action, Driver, SetupAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { Signal } from '../../rx/signal'

export const FocusType = Symbol('focus')
export type Focus = SetupAction<
    typeof FocusType,
    FocusDriver
> & {
    signal: Signal
}

export type FocusDriver<N = any, S extends Action = never > = {
    [FocusType]: Driver<N, Focus, S>
}

export function focus(signal: Signal): Focus {
    return action({
        type: FocusType,
        signal
    })
}