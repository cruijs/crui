import { Action, AnyNodeAction, Driver, NodeAction } from '../../types'
import { action } from '../action'

export const HoistOnMountedType = Symbol('hoistOnMounted')
export type HoistOnMounted<E extends AnyNodeAction> = NodeAction<
    typeof HoistOnMountedType,
    HoistOnMountedDriver & E['_drivers'],
    E['_restriction']
> & {
    elem: E
}

export type HoistOnMountedDriver<N = any, E extends AnyNodeAction = any, S extends Action = never> = {
    [HoistOnMountedType]: Driver<N, HoistOnMounted<E>, S|E, N>
}

export function hoistOnMounted<E extends AnyNodeAction>(elem: E): HoistOnMounted<E> {
    return action({
        type: HoistOnMountedType,
        elem,
    })
}