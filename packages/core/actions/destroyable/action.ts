import { CleanupDriver } from '../../../eg-reactive-todos/v2/actions/cleanup/index'
import { Action, Driver, ProvideDriver } from '../../types'
import { DestroyDriver } from './destroy'
import { action } from '../action'

export const DestroyableType = Symbol('destroyable')
export type DestroyableDriver<N = any, A extends Action = any> = {
    [DestroyableType]: Driver<N, Destroyable<A>, A, A['_return']>
}
export type Destroyable<A extends Action> = Action<
    typeof DestroyableType,
    DestroyableDriver & ProvideDriver<CleanupDriver|DestroyDriver, A>,
    A['_restriction'],
    A['_return'],
    A['_isNode']
> & {
    action: A,
}

export function destroyable<A extends Action>(a: A): Destroyable<A> {
    return action({
        type: DestroyableType,
        action: a
    })
}