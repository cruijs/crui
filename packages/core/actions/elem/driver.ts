import { constMap } from '../../../eg-reactive-todos/v2/deferred'
import { Emitter } from '../../scheduler/emitter'
import { AnyAction, AnyNodeAction } from '../../types'
import { bind, Deferred, joinAll, waitAll } from '../../utils/deferred'
import { append, Append } from '../append'
import { CreateTag, createTag } from '../createTag'
import { Elem, ElemDriver, ElemType } from './index'

function driver<N, A extends AnyAction, C extends AnyNodeAction<N>>(
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

export const elemDriver: ElemDriver<any, any, any> = {
    [ElemType]: driver
}