import { Tag } from '../../../../core/types'
import { Action, AnyAction, Driver, RemoveRestr, UtoI } from '../../types'
import { action } from '../action'
import { TagMR, TagR } from '../tagAction'

export const ElemType = Symbol('elem')
export type ElemDriver<A extends AnyAction, N = any> = {
    [ElemType]: Driver<N, Elem<Tag, A>, A>
}

export type Elem<T extends Tag, A extends AnyAction> =
    Action<
        typeof ElemType,
        ElemD<A>,
        ElemR<A>
    > & {
        tag: T
        actions: readonly A[]
    }

type ElemR<A extends AnyAction> = UtoI<RemoveRestr<TagR<any>, A>>
type ElemD<A extends AnyAction> = ElemDriver<A> & UtoI<A['_drivers']>

export function h<T extends Tag, A extends AnyAction>(
    tag: T,
    actions: readonly TagMR<A, T>[]
): Elem<T, A> {
    return action({
        type: ElemType,
        tag,
        actions,
    })
}