import { Tag } from '@crui/core/dom'
import { Deferred } from '../../deferred'
import { Action, AnyAction, Driver, MatchRestr, RemoveDriver, RemoveRestr, UtoI } from '../../types'
import { action } from '../action'
import { TagR } from '../tagAction'
import { DynamicDriver, DynamicR } from './dynamic'

export const TemplateType = Symbol('template')
export type DriverF<A extends AnyAction, N = any, T = any> = Driver<
        N,
        Template<Tag, A, T, N>,
        A,
        MakeItem<T, N>
    >
export type TemplateDriver<A extends AnyAction, N = any, T = any> = {
    [TemplateType]: DriverF<A, N, T>
}
export type Restr<T extends Tag, D> = TagR<T> & DynamicR<D>
export type MakeItem<T, N> = (item: T) => Deferred<N>

type DeriveDriver<T, A extends AnyAction> = TemplateDriver<A> & UtoI<
    RemoveDriver<
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
    actions: readonly MatchRestr<TagR<T>, A>[]
): Template<T, A, V> {
    return action({
        type: TemplateType,
        tag,
        actions,
    })
}