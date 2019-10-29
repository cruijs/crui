import { Driver, SetupAction } from '../../types'
import { action } from '../action'

export const RemoveType = Symbol('remove')
export type RemoveDriver<N> = {
    [RemoveType]: Driver<N, Remove<N>, never, void>
}
export type Remove<N> =
    SetupAction<
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