import { Action, AnyNodeAction, Driver, InfraAction, ProvideDriver, RemoveRestr, UtoI } from '../../types'
import { Deferred } from '../../utils/deferred'
import { action } from '../action'
import { DynamicNodeDriver, DynamicR, DynamicSetupDriver } from './dynamic'

export const TemplateType = Symbol('template')
export type TemplateDriver<
    N = any,
    V = any,
    E extends AnyNodeAction<N> = any,
    S extends Action = never
> = {
    [TemplateType]: Driver<
        N,
        Template<V, E, N>,
        E|S,
        MakeItem<V, N>
    >
}
export type MakeItem<V, N> = (item: V) => Deferred<N>

type DeriveDriver<N, V, E extends AnyNodeAction<N>> = TemplateDriver<N, V, E, any> & UtoI<
    ProvideDriver<
        DynamicSetupDriver<V> & DynamicNodeDriver<V>, 
        E['_drivers']
    >
>
export type Template<V, E extends AnyNodeAction<N> = any, N = any> =
    InfraAction<
        typeof TemplateType,
        DeriveDriver<N, V, E>,
        UtoI<RemoveRestr<DynamicR<V>, E>>,
        MakeItem<V, N>
    > & {
        elem: E
    }

export function template<V, E extends AnyNodeAction>(
    elem: E,
): Template<V, E> {
    return action({
        type: TemplateType,
        elem
    })
}