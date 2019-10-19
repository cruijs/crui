import { Tag } from '../../../../core/types'
import { Action, AnyAction, Driver, MatchRestr, RemoveRestr, UtoI } from '../../types'
import { action } from '../action'
import { TagR } from '../tagAction'

export const ElemType = Symbol('elem')
export type ElemDriver<A extends AnyAction, N = any> = {
    [ElemType]: Driver<N, Elem<Tag, A>, A>
}

export type Elem<T extends Tag, A extends AnyAction> =
    Action<
        typeof ElemType,
        ElemDriver<A> & UtoI<A['_drivers']>,
        UtoI<RemoveRestr<TagR<T>, A>>
    > & {
        tag: T
        actions: readonly A[]
    }

export function h<T extends Tag, A extends AnyAction>(
    tag: T,
    actions: readonly MatchRestr<TagR<T>, A>[]
): Elem<T, A> {
    return action({
        type: ElemType,
        tag,
        actions,
    })
}

export const child = h