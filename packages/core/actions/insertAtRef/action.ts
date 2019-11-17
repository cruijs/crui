import { Action, Driver, InfraAction } from '../../types'
import { action } from '../action'

export const InsertAtRefType = Symbol('insertAtRef')
export type InsertAtRefDriver<N, S extends Action = never> = {
    [InsertAtRefType]: Driver<N, InsertAtRef<N>, S>
}
export type InsertAtRef<N> =
    InfraAction<
        typeof InsertAtRefType,
        InsertAtRefDriver<N>
    > & {
        node: N,
        ref: N,
        index: number
    }

export function insertAtRef<N>(node: N, ref: N, index: number): InsertAtRef<N> {
    return action({
        type: InsertAtRefType,
        node,
        ref,
        index
    })
}