import { Action, Driver } from '../../types'
import { action } from '../action'

export const InsertAtType = Symbol('insertAt')
export type InsertAtDriver<N> = {
    [InsertAtType]: Driver<N, InsertAt<N>>
}
export type InsertAt<N> =
    Action<
        typeof InsertAtType,
        InsertAtDriver<N>
    > & {
        node: N,
        index: number
    }

export function insertAt<N>(node: N, index: number): InsertAt<N> {
    return action({
        type: InsertAtType,
        node,
        index
    })
}