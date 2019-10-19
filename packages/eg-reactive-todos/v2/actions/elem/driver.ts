import { Deferred, then } from '../../deferred'
import { Emitter } from '../../emitter'
import { Append, append } from '../append'
import { CreateTag, createTag } from '../createTag'
import { TagAction } from '../tagAction'
import { Elem } from './index'

export function elemDriver<N, A extends TagAction>(
    parent: N,
    { tag, actions }: Elem<any, A>,
    { emit }: Emitter<N, A | CreateTag<N> | Append<N>>
): Deferred<N> {
    return then(emit(parent, createTag(tag)), (node: N) => {
        actions.forEach((a) => {
            emit(node, a);
        })
        emit(parent, append(node))
        return node
    });
}