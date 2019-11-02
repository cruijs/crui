import { Tag, TagMR, TagR } from '../../restrictions/tag'
import { AnySetupAction, AnyNodeAction, Driver, NodeAction, RemoveRestr, UtoI } from '../../types'
import { action } from '../action'

export const ElemType = Symbol('elem')
export type ElemDriver<N = any, A extends AnySetupAction = any, C extends AnyNodeAction = any> = {
    [ElemType]: Driver<N, Elem<Tag, A, C>, A>
}

export type Elem<
    T extends Tag = any,
    A extends AnySetupAction = any,
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

type ElemR<A extends AnySetupAction, C extends AnyNodeAction> = 
    UtoI<RemoveRestr<TagR<any>, A>> & UtoI<C['_restriction']>

type ElemD<A extends AnySetupAction, C extends AnyNodeAction> = 
    ElemDriver<any, A, C> & UtoI<A['_drivers']> & UtoI<C['_drivers']>

export function h<T extends Tag, A extends AnySetupAction, C extends AnyNodeAction>(
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