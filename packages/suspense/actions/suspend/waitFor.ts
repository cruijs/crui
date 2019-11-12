import { Action, Driver, InfraAction } from '@crui/core'
import { action } from '@crui/core/actions/action'

export const WaitForType = Symbol('waitFor')
export type WaitFor = InfraAction<
    typeof WaitForType,
    WaitForDriver
> & {
    promise: PromiseLike<any>
}

export type WaitForDriver<N = any, S extends Action = never> = {
    [WaitForType]: Driver<N, WaitFor, S>
}

export function waitFor(promise: PromiseLike<any>): WaitFor {
    return action({
        type: WaitForType,
        promise,
    })
}