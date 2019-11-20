import { Action, AnyNodeAction, Driver, NodeAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { WDim } from '../../dimensions'

export const MeasureType = Symbol('measure')
export type Measure<E extends AnyNodeAction> = NodeAction<
    typeof MeasureType,
    MeasureDriver & E['_drivers'],
    E['_restriction']
> & {
    elem: E,
    dim: WDim
}

export type MeasureDriver<
    N = any,
    E extends AnyNodeAction = any,
    S extends Action = never
> = {
    [MeasureType]: Driver<N, Measure<E>, E|S, N>
}

export function measure<E extends AnyNodeAction = any>(dim: WDim, elem: E): Measure<E> {
    return action({
        type: MeasureType,
        elem,
        dim
    })
}