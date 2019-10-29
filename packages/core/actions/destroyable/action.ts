import { AnyNodeAction, Driver, NodeAction, ProvideDriver } from '../../types'
import { action } from '../action'
import { CleanupDriver } from './cleanup'

export const DestroyableType = Symbol('destroyable')
export type DestroyableDriver<N = any, A extends AnyNodeAction = any> = {
    [DestroyableType]: Driver<N, Destroyable<A>, A, A['_return']>
}
export type Destroyable<E extends AnyNodeAction> = NodeAction<
    typeof DestroyableType,
    DestroyableDriver & ProvideDriver<CleanupDriver, E>,
    E['_return'],
    E['_restriction']
> & {
    elem: E,
}

export function destroyable<E extends AnyNodeAction>(elem: E): Destroyable<E> {
    return action({
        type: DestroyableType,
        elem
    })
}