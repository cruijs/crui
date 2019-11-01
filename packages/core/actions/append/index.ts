import { Driver, InfraAction } from '../../types'
import { action } from '../action'

export const AppendType = Symbol('append')
export type AppendDriver<N> = {
    [AppendType]: Driver<N, Append<N>>
}
export type Append<N> =
    InfraAction<
        typeof AppendType,
        AppendDriver<N>
    > & {
        node: N,
    }

export function append<N>(node: N): Append<N> {
    return action({
        type: AppendType,
        node,
    })
}