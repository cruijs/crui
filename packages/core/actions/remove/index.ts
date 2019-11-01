import { Driver, InfraAction } from '../../types'
import { action } from '../action'
import { Destroy } from '../destroyable'

export const RemoveType = Symbol('remove')
export type RemoveDriver<N> = {
    [RemoveType]: Driver<N, Remove<N>, Destroy, void>
}
export type Remove<N> =
    InfraAction<
        typeof RemoveType,
        RemoveDriver<N>
    > & {
        node: N,
    }

export function remove<N>(node: N): Remove<N> {
    return action({
        type: RemoveType,
        node,
    })
}