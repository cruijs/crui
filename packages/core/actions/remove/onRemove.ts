import { Action, AsyncFn, Driver, InfraAction } from '../../types'
import { action } from '../action'

export const OnRemoveType = Symbol('onRemove')
export type OnRemove = InfraAction<
    typeof OnRemoveType,
    OnRemoveDriver
> & {
    handler: AsyncFn
}

export type OnRemoveDriver<N = any, S extends Action = never> = {
    [OnRemoveType]: Driver<N, OnRemove, S>
}

export function onRemove(handler: AsyncFn): OnRemove {
    return action({
        type: OnRemoveType,
        handler,
    })
}