import { AnyNodeAction, Driver, InfraAction } from '../../types'
import { action } from '../action'
import { Append } from '../append'
import { Mounted } from './mounted'

export const MountType = Symbol('mount')
export type Mount<E extends AnyNodeAction> = InfraAction<
    typeof MountType,
    MountDriver<any, E>
> & {
    elem: E
}

export type MountDriver<N, E extends AnyNodeAction = any> = {
    [MountType]: Driver<N, Mount<E>, E|Append<N>|Mounted>
}

export function mount<E extends AnyNodeAction>(elem: E): Mount<E> {
    return action({
        type: MountType,
        elem,
    })
}