import { Action, AnyNodeAction, Driver, InfraAction } from '../../types'
import { action } from '../action'

export const MemoizeType = Symbol('memoize')
export type MemoizeDriver<N, E extends AnyNodeAction = any, S extends Action = never> = {
    [MemoizeType]: Driver<N, Memoize<E>, E|S>
}
export type Memoize<E extends AnyNodeAction> = 
    InfraAction<
        typeof MemoizeType,
        MemoizeDriver<any, E>,
        E['_restriction'],
        E['_return']
    > & {
        elem: E
    }

export function memoize<E extends AnyNodeAction>(elem: E): Memoize<E> {
    return action({
        type: MemoizeType,
        elem,
    })
}