import { Tag, TagR } from '../../restrictions/tag'
import { Action, AnyAction, Driver, MatchRestr, ProvideDriver, RemoveRestr, UtoI } from '../../types'
import { Deferred } from '../../utils/deferred'
import { action } from '../action'
import { DynamicDriver, DynamicR } from './dynamic'

export const TemplateType = Symbol('template')
export type TemplateDriver<V = any, T extends Tag = Tag, A extends AnyAction = AnyAction, N = any> = {
    [TemplateType]: Driver<
        N,
        Template<V, T, A, N>,
        A,
        MakeItem<V, N>
    >
}
export type Restr<T extends Tag, D> = TagR<T> & DynamicR<D>
export type MakeItem<T, N> = (item: T) => Deferred<N>

type DeriveDriver<V, T extends Tag, A extends AnyAction, N> = TemplateDriver<V, T, A, N> & UtoI<
    ProvideDriver<
        DynamicDriver<V, AnyAction>, 
        A['_drivers']
    >
>
export type Template<V, T extends Tag = any, A extends AnyAction = any, N = any> =
    Action<
        typeof TemplateType,
        DeriveDriver<V, T, A, N>,
        UtoI<RemoveRestr<Restr<T, V>, A>>,
        MakeItem<V, N>
    > & {
        tag: T
        actions: readonly A[]
    }

export function template<V, T extends Tag, A extends AnyAction>(
    tag: T,
    actions: readonly MatchRestr<Restr<T, V>, A>[]
): Template<V, T, A> {
    return action({
        type: TemplateType,
        tag,
        actions,
    })
}