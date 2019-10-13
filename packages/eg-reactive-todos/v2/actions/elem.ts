import { Tag } from '../../../core/types'
import { then, Deferred } from '../deferred'
import { Emitter } from '../emitter'
import { Action, Driver } from '../types'
import { CreateTag, createTag } from './createTag'
import { TagAction } from './tagAction'
import { action } from './action'
import { Append, append } from './append'

export const ElemType = Symbol('h')
export type ElemDriver<A extends TagAction, N = any> = {
    [ElemType]: Driver<N, Elem<Tag, A>, A>
}

type UtoI<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

export type Elem<T extends Tag, A extends TagAction> =
    Action<
        typeof ElemType,
        ElemDriver<A> & UtoI<A['_d']>,
        A['_r']
    > & {
        tag: T
        actions: readonly A[]
    }

export function h<T extends Tag, A extends TagAction>(tag: T, actions: readonly A[]): Elem<T, A> {
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