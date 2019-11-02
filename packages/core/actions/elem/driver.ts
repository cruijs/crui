import { Emitter } from '../../scheduler/emitter'
import { AnyNodeAction, AnySetupAction } from '../../types'
import { bind, constMap, Deferred, joinAll, waitAll } from '../../utils/deferred'
import { append, Append } from '../append'
import { CreateTag, createTag } from '../createTag'
import { Elem, ElemDriver, ElemType } from './index'

export const makeElemDriver = <N, A extends AnySetupAction, C extends AnyNodeAction<N>>(
): ElemDriver<N, A, C> => ({
    [ElemType]: driver
})

function driver<N, A extends AnySetupAction, C extends AnyNodeAction<N>>(
    parent: N,
    { tag, actions, children }: Elem<any, A, C>,
    { emit }: Emitter<N, A | C | Append<N> | CreateTag<N>>
): Deferred<N> {
    return bind(emit(parent, createTag(tag)), (node: N) => {
        const ds = actions.map((a) =>
            emit(node, a)
        )
        ds.push(bind(
            joinAll(children.map((c) =>
                emit(node, c)
            )),
            (children) =>
                waitAll(children.map((a) => emit(node, append(a))))
        ))

        return constMap(node, waitAll(ds))
    })
}