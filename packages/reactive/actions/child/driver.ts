import { AnyNodeAction, cleanup, Destroyable, Memoize, replace, Replace, then } from '@crui/core'
import { $ChildDriver, $ChildType } from './index'

export const make$ChildDriver = <N, E extends AnyNodeAction<N>, T = any>(): $ChildDriver<N, T, E, Replace<N>|Destroyable<E>|Memoize<E>> => ({
    [$ChildType]: (_, { stream, make, wrap }, { emit }) => {
        let prev: N|undefined
        const f = (val: T) => then(
            emit(_, wrap(make(val))),
            (node) => {
                if (prev)
                    emit(_, replace(prev, node))
                prev = node
            }
        )

        stream.subscribe(f)
        emit(_, cleanup(stream.destroy))
        return f(stream.get())
    }
})