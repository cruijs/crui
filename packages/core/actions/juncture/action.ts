import { Action, AnyNodeAction, Driver, NodeAction } from '../../types'
import { action } from '../action'

export const JunctureType = Symbol('juncture')
export type Juncture<E extends AnyNodeAction> = NodeAction<
    typeof JunctureType,
    JunctureDriver & E['_drivers'],
    E['_restriction']
> & {
    elem: E
}

export type JunctureDriver<N = any, E extends AnyNodeAction = any, S extends Action = never> = {
    [JunctureType]: Driver<N, Juncture<E>, S|E, N>
}

export function juncture<E extends AnyNodeAction>(elem: E): Juncture<E> {
    return action({
        type: JunctureType,
        elem,
    })
}