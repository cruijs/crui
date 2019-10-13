import { Tag } from '../../../core/types'
import { Deferred, then } from '../deferred'
import { Emitter } from '../emitter'
import { Action, AnyAction, Driver, MatchRestr, RemoveRestr, UtoI } from '../types'
import { action } from './action'
import { Append, append } from './append'
import { CreateTag, createTag } from './createTag'
import { TagAction, TagR } from './tagAction'

export const ElemType = Symbol('h')
export type ElemDriver<A extends AnyAction, N = any> = {
    [ElemType]: Driver<N, Elem<Tag, A>, A>
}

export type Elem<T extends Tag, A extends AnyAction> =
    Action<
        typeof ElemType,
        ElemDriver<A> & UtoI<A['_drivers']>,
        UtoI<RemoveRestr<TagR<T>, A>>
    > & {
        tag: T
        actions: readonly A[]
    }

export function h<T extends Tag, A extends AnyAction>(
    tag: T,
    actions: readonly MatchRestr<TagR<T>, A>[]
): Elem<T, A> {
    return action({
        type: ElemType,
        tag,
        actions,
    })
}

export const child = h

export function elemDriver<N, A extends TagAction>(
    parent: N,
    action: Elem<any, A>,
    scheduler: Emitter<N, A | CreateTag<N> | Append<N>>
): Deferred<N> {
    return then(scheduler.emit(parent, createTag(action.tag)), (node: N) => {
        action.actions.forEach((a) => {
            scheduler.emit(node, a)
        })
        scheduler.emit(parent, append(node))
        return node
    })
}