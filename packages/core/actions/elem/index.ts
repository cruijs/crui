import { Tag, TagMR, TagR } from '../../restrictions/tag'
import { AnyAction, AnyNodeAction, Driver, NodeAction, RemoveRestr, UtoI } from '../../types'
import { action } from '../action'

export const ElemType = Symbol('elem')
export type ElemDriver<A extends AnyAction, C extends AnyNodeAction, N = any> = {
    [ElemType]: Driver<N, Elem<Tag, A, C>, A>
}

export type Elem<
    T extends Tag = any,
    A extends AnyAction = any,
    C extends AnyNodeAction = any
> =
    NodeAction<
        typeof ElemType,
        ElemD<A, C>,
        ElemR<A, C>
    > & {
        tag: T,
        actions: readonly A[],
        children: readonly C[],
    }

type ElemR<A extends AnyAction, C extends AnyNodeAction> = 
    UtoI<RemoveRestr<TagR<any>, A>> & UtoI<C['_restriction']>

type ElemD<A extends AnyAction, C extends AnyNodeAction> = 
    ElemDriver<A, C> & UtoI<A['_drivers']> & UtoI<C['_drivers']>

export function h<T extends Tag, A extends AnyAction, C extends AnyNodeAction>(
    tag: T,
    actions: readonly TagMR<A, T>[],
    children: readonly C[] = [],
): Elem<T, A, C> {
    return action({
        type: ElemType,
        tag,
        actions,
        children
    })
}

export function hc<T extends Tag, C extends AnyNodeAction>(
    tag: T,
    children: readonly C[] = []
) {
    return h(tag, [], children)
}