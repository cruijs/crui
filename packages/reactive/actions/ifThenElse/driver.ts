import { AnyNodeAction, Cleanup, cleanup } from '@crui/core'
import { map } from '../../rx/box/map'
import { $Child, $child } from '../child'
import { IfThenElseDriver, IfThenElseType } from './index'

export const makeIfThenElseDriver = <N, T extends AnyNodeAction, F extends AnyNodeAction>(): IfThenElseDriver<N, T, F, $Child<T|F>|Cleanup> => ({
    [IfThenElseType]: (_, { cond, onTrue, onFalse, wrap }, { emit }) => {
        const stream = map(cond, (c) => c ? onTrue : onFalse)
        emit(_, cleanup(cond.destroy))
        return emit(_, $child(stream, wrap))
    }
})