import { AnyNodeAction, Cleanup, cleanup, pipe, Replace, replace } from '@crui/core'
import { IfThenElseDriver, IfThenElseType } from './index'

export const makeIfThenElseDriver = <N, T extends AnyNodeAction, F extends AnyNodeAction>(): IfThenElseDriver<N, T, F, Replace<N>|Cleanup> => ({
    [IfThenElseType]: (parent, { cond, onTrue, onFalse }, { emit }) => {
        emit(parent, cleanup(cond.destroy))

        let prev: N|undefined
        const f = (cond: boolean) => {
            const elem = emit(parent, cond ? onTrue : onFalse)
            pipe(
                elem,
                (node) => {
                    if (prev)
                        emit(parent, replace(prev, node))
                    prev = node
                }
            )
            return elem
        }

        cond.subscribe(f)
        return f(cond.get())
    }
})