import { AnyNodeAction, bind, cleanup, Destroyable, JunctureNode, junctureNode, Memoize, replace, Replace, then } from '@crui/core'
import { $ChildDriver, $ChildType } from './index'

type AReq<N, E extends AnyNodeAction> =
    Replace<N>
    | Destroyable<E>
    | Memoize<E>
    | JunctureNode<N>

export const make$ChildDriver = <N, E extends AnyNodeAction<N>, T = any>(
): $ChildDriver<N, T, E, AReq<N, E>> => ({
    [$ChildType]: (_, { stream, make, wrap }, { emit }) => {
        let prev: N | undefined
        const f = (val: T) => bind(
            emit(_, junctureNode<N>()),
            ({ emit }) => then(
                emit(_, wrap(make(val))),
                (node) => {
                    if (prev)
                        emit(_, replace(prev, node))
                    prev = node
                }
            )
        )

        stream.subscribe(f)
        emit(_, cleanup(stream.destroy))
        return f(stream.get())
    }
})