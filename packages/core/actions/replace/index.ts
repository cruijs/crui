import { Driver, SetupAction } from '../../types'
import { action } from '../action'
import { Destroy } from '../destroyable'

export const ReplaceType = Symbol('replace')
export type ReplaceDriver<N> = {
    [ReplaceType]: Driver<N, Replace<N>, Destroy, void>
}
export type Replace<N> =
    SetupAction<
        typeof ReplaceType,
        ReplaceDriver<N>
    > & {
        prev: N,
        next: N,
    }

export function replace<N>(prev: N, next: N): Replace<N> {
    return action({
        type: ReplaceType,
        prev,
        next,
    })
}