import { Action, Driver, NodeAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { AnyNodeAction } from '@crui/core/types'
import { AsyncNodeR } from '../../restriction'

export const AsyncNodeType = Symbol('asyncNode')
export type AsyncNode<T, E extends AnyNodeAction> = NodeAction<
    typeof AsyncNodeType,
    AsyncNodeDriver<any, T, E> & E['_drivers'],
    AsyncNodeR & E['_restriction']
> & {
    promise: PromiseLike<T>,
    make: (value: T) => E
}

export type AsyncNodeDriver<
    N = any,
    T = any,
    E extends AnyNodeAction = any,
    S extends Action = never
> = {
    [AsyncNodeType]: Driver<N, AsyncNode<T, E>, E|S>
}

export function asyncNode<T, E extends AnyNodeAction>(
    promise: PromiseLike<T>,
    make: (value: T) => E
): AsyncNode<T, E> {
    return action({
        type: AsyncNodeType,
        promise,
        make
    })
}