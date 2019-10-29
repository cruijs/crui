import { AnyNodeAction, cleanup, destroy, Destroy, pipe, replace, Replace } from '@crui/core'
import { $ChildDriver, $ChildType } from './index'

export const make$ChildDriver = <N, E extends AnyNodeAction<N>>(): $ChildDriver<N, E, Replace<N>|Destroy> => ({
    [$ChildType]: (parent, { stream }, { emit }) => {
        let prev: N|undefined
        const f = (elem: E) => {
            const d = emit(parent, elem)
            pipe(d, (node) => {
                if (prev === undefined) {
                    prev = node
                }
                else {
                    emit(parent, replace(prev, node))
                    emit(prev, destroy)
                }
            })
            return d
        }

        stream.subscribe(f)
        emit(parent, cleanup(stream.destroy))

        return f(stream.get())
    }
})