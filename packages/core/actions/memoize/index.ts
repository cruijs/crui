import { Action, AnyNodeAction, Driver, NodeAction } from '../../types'
import { action } from '../action'
import { Destroyable } from '../destroyable/action'

export const MemoizeType = Symbol('memoize')
export type MemoizeDriver<E extends AnyNodeAction, N = any, S extends Action = never> = {
    [MemoizeType]: Driver<N, Memoize<E>|S, E>
}
export type Memoize<E extends AnyNodeAction> = 
    NodeAction<
        typeof MemoizeType,
        MemoizeDriver<E>,
        E['_restriction'],
        E['_return']
    > & {
        elem: E
    }

type NoDestroyable<E> = E extends Destroyable<any> ? never : E

export function memoize<E extends AnyNodeAction>(elem: NoDestroyable<E>): Memoize<E> {
    return action({
        type: MemoizeType,
        elem,
    })
}