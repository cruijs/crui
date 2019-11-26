import { Emitter } from '../../scheduler/emitter'
import { Action, Driver, InfraAction } from '../../types'
import { action } from '../action'

export const JunctureNodeType = Symbol('junctureNode')
export type JunctureNode<N> = InfraAction<
    typeof JunctureNodeType,
    JunctureNodeDriver,
    {},
    Emitter<N>
>

export type JunctureNodeDriver<N = any, S extends Action = never> = {
    [JunctureNodeType]: Driver<N, JunctureNode<N>, S, Emitter<N>>
}

export function junctureNode<N>(): JunctureNode<N> {
    return action({
        type: JunctureNodeType
    })
}