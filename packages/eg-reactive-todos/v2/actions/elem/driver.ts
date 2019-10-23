import { Deferred, thread } from '../../deferred'
import { Emitter } from '../../emitter'
import { AnyAction } from '../../types'
import { Append, append } from '../append'
import { CreateTag, createTag } from '../createTag'
import { Elem } from './index'

export function elemDriver<N, A extends AnyAction>(
    parent: N,
    { tag, actions }: Elem<any, A>,
    { emit }: Emitter<N, A | CreateTag<N> | Append<N>>
): Deferred<N> {
    return thread(emit(parent, createTag(tag)), (node: N) => {
        actions.forEach((a) => {
            emit(node, a)
        })
        return emit(parent, append(node))
    });
}