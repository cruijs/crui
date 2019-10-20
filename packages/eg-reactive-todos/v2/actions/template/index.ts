import { Tag } from '@crui/core/dom'
import { Deferred } from '../../deferred'
import { Action, AnyAction, Driver, MatchRestr, ProvideDriver, RemoveRestr, UtoI } from '../../types'
import { action } from '../action'
import { TagR } from '../tagAction'
import { DynamicDriver, DynamicR } from './dynamic'

export const TemplateType = Symbol('template')
export type TemplateDriver<A extends AnyAction, N = any, T = any> = {
    [TemplateType]: Driver<
        N,
        Template<Tag, A, T, N>,
        A,
        MakeItem<T, N>
    >
}
export type Restr<T extends Tag, D> = TagR<T> & DynamicR<D>
export type MakeItem<T, N> = (item: T) => Deferred<N>

type DeriveDriver<T, A extends AnyAction> = TemplateDriver<A> & UtoI<
    ProvideDriver<
        DynamicDriver<T, AnyAction>, 
        A['_drivers']
    >
>
export type Template<T extends Tag, A extends AnyAction, V, N = any> =
    Action<
        typeof TemplateType,
        DeriveDriver<V, A>,
        UtoI<RemoveRestr<Restr<T, V>, A>>,
        MakeItem<V, N>
    > & {
        tag: T
        actions: readonly A[]
    }

export function template<T extends Tag, A extends AnyAction, V>(
    tag: T,
    actions: readonly MatchRestr<Restr<T, V>, A>[]
): Template<T, A, V> {
    return action({
        type: TemplateType,
        tag,
        actions,
    })
}