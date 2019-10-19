import { Action, AnyAction, Driver } from '../../../types'
import { action } from '../../action'

export const DynamicType = Symbol('dynamic')
export type DynamicDriver<T, A extends AnyAction, N = any> = {
    [DynamicType]: Driver<N, Dynamic<T, A>>
}
export type DynamicR<T> = {
    dynamic: T
}
export type MakeAction<T, A extends AnyAction> = (item: T) => A
export type Dynamic<T, A extends AnyAction> = Action<
    typeof DynamicType,
    DynamicDriver<T, A> & A['_drivers'],
    DynamicR<T> & A['_restriction']
> & {
    make: MakeAction<T, A>
}

export function dynamic<T, A extends AnyAction>(make: MakeAction<T, A>): Dynamic<T, A> {
    return action({
        type: DynamicType,
        make
    })
}