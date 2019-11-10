import { Action, NodeAction, Driver } from '../../types'
import { action } from '../action'

export const EmptyNodeType = Symbol('EmptyNode')
export type EmptyNode<N> = NodeAction<typeof EmptyNodeType, EmptyNodeDriver, {}, N>

export type EmptyNodeDriver<N = any, S extends Action = never> = {
    [EmptyNodeType]: Driver<N, EmptyNode<N>, S>
}

export const emptyNode = action({ type: EmptyNodeType })