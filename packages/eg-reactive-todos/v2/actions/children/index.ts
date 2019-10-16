import { Action, Driver, UtoI } from '../../types'
import { action } from '../action'
import { Elem } from '../elem'
import { TagR } from '../tagAction'

export const ChildrenType = Symbol('children')
export type ChildrenDriver<E extends Elem<any, any>, N = any> = {
    [ChildrenType]: Driver<N, Children<any>, E>
}
export type Children<E extends Elem<any, any>, N = any> = 
    Action<
        typeof ChildrenType,
        ChildrenDriver<E> & UtoI<E['_drivers']>,
        TagR,
        N[]
    > & {
        children: E[],
    }

export function children<E extends Elem<any, any>>(cs: E[]): Children<E> {
    return action({
        children: cs
    })
}