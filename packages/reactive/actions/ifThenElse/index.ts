import { Action, AnyNodeAction, Driver, memoize, NodeAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { Cond$B } from '../../rx/box'
import { Wrap } from '../wrap'

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
        wrap: Wrap,
    }

export function ite<T extends AnyNodeAction, F extends AnyNodeAction>(
    cond: Cond$B,
    onTrue: T,
    onFalse: F,
    wrap: Wrap = memoize
): IfThenElse<T, F> {
    return action({
        type: IfThenElseType,
        cond,
        onTrue,
        onFalse,
        wrap,
    })
}