import { Action, Driver } from '../../../types'
import { action } from '../../action'

export const DynamicType = Symbol('dynamic')
export type DynamicDriver<T, A extends Action, N = any> = {
    [DynamicType]: Driver<N, Dynamic<T, A>>
}
export type DynamicR<T> = {
    dynamic: T
}
export type MakeAction<T, A extends Action> = (item: T) => A
export type Dynamic<T, A extends Action> = Action<
    typeof DynamicType,
    DynamicDriver<T, A> & A['_drivers'],
    DynamicR<T> & A['_restriction'],
    A['_return'],
    A['_kind']
> & {
    make: MakeAction<T, A>
}

export function dynamic<T, A extends Action>(make: MakeAction<T, A>): Dynamic<T, A> {
    return action({
        type: DynamicType,
        make
    })
}