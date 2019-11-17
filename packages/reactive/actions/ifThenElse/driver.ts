import { AnyNodeAction, Cleanup, cleanup } from '@crui/core'
import { $Child, $child } from '../child'
import { IfThenElseDriver, IfThenElseType } from './index'

export const makeIfThenElseDriver = <N, T extends AnyNodeAction, F extends AnyNodeAction>(): IfThenElseDriver<N, T, F, $Child<boolean, T|F>|Cleanup> => ({
    [IfThenElseType]: (_, { cond, onTrue, onFalse, wrap }, { emit }) => {
        emit(_, cleanup(cond.destroy))
        return emit(_, $child(
            cond,
            (b) => b ? onTrue : onFalse,
            wrap
        ))
    }
})