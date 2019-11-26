import { Action, Driver, Fn0, InfraAction } from '../../types'
import { action } from '../action'

export type Handler = Fn0

export const OnMountedType = Symbol('onMounted')
export type OnMounted = InfraAction<
    typeof OnMountedType,
    OnMountedDriver
> & {
    handler: Handler
}

export type OnMountedDriver<N = any, S extends Action = never> = {
    [OnMountedType]: Driver<N, OnMounted, S>
}

export function onMounted(handler: Handler): OnMounted {
    return action({
        type: OnMountedType,
        handler,
    })
}