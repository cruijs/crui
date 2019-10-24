import { Deferred, bind, waitAll } from '../../deferred'
import { Emitter } from '../../emitter'
import { AnyAction } from '../../types'
import { Append, append } from '../append'
import { CreateTag, createTag } from '../createTag'
import { Elem, ElemType } from './index'

function driver<N, A extends AnyAction>(
    parent: N,
    { tag, actions }: Elem<any, A>,
    { emit }: Emitter<N, A | CreateTag<N> | Append<N>>
): Deferred<N> {
    return bind(emit(parent, createTag(tag)), (node: N) => (
        bind(
            waitAll(actions.map((a) =>
                emit(node, a)
            )),
            () => emit(parent, append(node))
        )
    ))
}

export const elemDriver = {
    [ElemType]: driver
}