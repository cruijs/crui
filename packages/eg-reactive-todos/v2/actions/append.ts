import { Driver, Action } from '../types'

export const AppendType = Symbol('append')
export type AppendDriver<N> = {
    append: Driver<Append<N>, {}>
}
export type Append<N> =
    Action<
        typeof AppendType,
        AppendDriver<N>,
        {}
    > & {
        node: N,
    }

export function append<N>(node: N): Append<N> {
    return {
        type: AppendType,
        node,
        _r: 0 as any,
        _d: 0 as any,
    }
}