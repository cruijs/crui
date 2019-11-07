import { Action, Driver, RemoveRestr } from '../../../types'
import { action } from '../../action'
import { DynamicNodeDriver } from '../dynamic/node'
import { DynamicSetupDriver } from '../dynamic/setup'
import { DynamicMR, DynamicR } from '../dynamic/types'

type Adapt<A, B> = (val: A) => B
export const DynAdaptType = Symbol('dynAdapt')
export type DynAdapt<T, P, A extends Action> = Action<
    typeof DynAdaptType,
    DynAdaptDriver<any, T, P, A> & A['_drivers'],
    DeriveR<T, P, A>,
    A['_return'],
    A['_kind']
> & {
    adapt: Adapt<T, P>
    wrapped: A
}

type DeriveR<T, P, A> =
    DynamicR<P> & RemoveRestr<DynamicR<T>, A>

export type DynAdaptDriver<
    N = any,
    T = any,
    P = any,
    A extends Action = any,
    S extends Action = never
> = {
    [DynAdaptType]: Driver<
        N,
        DynAdapt<T, P, A>, 
        A | S,
        A['_return'],
        DynamicNodeDriver<N> & DynamicSetupDriver<N>
    >
}

export function dynAdapt<T, P, A extends Action>(
    adapt: Adapt<T, P>,
    wrapped: DynamicMR<P, A>,
): DynAdapt<T, P, A> {
    return action({
        type: DynAdaptType,
        wrapped,
        adapt
    })
}