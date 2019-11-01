import { Action, AnyNodeAction, Driver, NodeAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { Cond$B } from '../../rx/box'

export const IfThenElseType = Symbol('ifThenElse')
export type IfThenElseDriver<
    N = any,
    T extends AnyNodeAction = any,
    F extends AnyNodeAction = any,
    S extends Action = never
> = {
    [IfThenElseType]: Driver<N, IfThenElse<T, F>, T|F|S>
}
export type IfThenElse<T extends AnyNodeAction, F extends AnyNodeAction> =
    NodeAction<
        typeof IfThenElseType,
        IfThenElseDriver
    > & {
        cond: Cond$B,
        onTrue: T,
        onFalse: F,
    }

export function ite<T extends AnyNodeAction, F extends AnyNodeAction>(
    cond: Cond$B,
    onTrue: T,
    onFalse: F,
): IfThenElse<T, F> {
    return action({
        type: IfThenElseType,
        cond,
        onTrue,
        onFalse,
    })
}