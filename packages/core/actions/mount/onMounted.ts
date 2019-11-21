import { Action, Driver, SetupAction } from '../../types'
import { action } from '../action'

export const OnMountedType = Symbol('onMounted')
export type OnMounted<N> = SetupAction<
    typeof OnMountedType,
    OnMountedDriver<N>
> & {
    handler: Handler<N>
}

export type Handler<N> = (node: N) => void

export type OnMountedDriver<N = any, S extends Action = never> = {
    [OnMountedType]: Driver<N, OnMounted<N>, S>
}

export function onMounted<N>(handler: Handler<N>): OnMounted<N> {
    return action({
        type: OnMountedType,
        handler,
    })
}