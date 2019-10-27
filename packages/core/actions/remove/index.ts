import { Action, Driver } from '../../types'
import { action } from '../action'

export const RemoveType = Symbol('remove')
export type RemoveDriver<N> = {
    [RemoveType]: Driver<N, Remove<N>>
}
export type Remove<N> =
    Action<
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