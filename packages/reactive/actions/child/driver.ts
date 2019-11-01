import { AnyNodeAction, cleanup, destroyable, Destroyable, pipe, replace, Replace } from '@crui/core'
import { $ChildDriver, $ChildType } from './index'

export const make$ChildDriver = <N, E extends AnyNodeAction<N>>(): $ChildDriver<N, E, Replace<N>|Destroyable<E>> => ({
    [$ChildType]: (parent, { stream }, { emit }) => {
        let prev: N|undefined
        const f = (elem: E) => {
            const d = emit(parent, destroyable(elem))
            pipe(d, (node) => {
                if (prev)
                    emit(parent, replace(prev, node)),
                prev = node
            })
            return d
        }

        stream.subscribe(f)
        emit(parent, cleanup(stream.destroy))

        return f(stream.get())
    }
})