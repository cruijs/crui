import { Action, Driver, NodeAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { AnyNodeAction, ProvideDriver } from '@crui/core/types'
import { AsyncNodeMR, AsyncNodeRM, NoAsyncNode } from '../../restriction'
import { WaitForDriver } from './waitFor'

type MkError<E> =
    (err: Error) => E

export const SuspendType = Symbol('suspend')
export type Suspend<
    L extends AnyNodeAction = any,
    E extends AnyNodeAction = any,
    A extends AnyNodeAction = any,
> = NodeAction<
    typeof SuspendType,
    DeriveD<L, E, A>,
    DeriveR<L, E, A>
> & {
    loader: L
    error: MkError<E>
    asyncNode: A
}

type DeriveD<
    L extends AnyNodeAction = any,
    E extends AnyNodeAction = any,
    A extends AnyNodeAction = any,
> =
    ProvideDriver<WaitForDriver, L & E & A>
    & SuspendDriver<any, L, E, A>

type DeriveR<
    L extends AnyNodeAction = any,
    E extends AnyNodeAction = any,
    A extends AnyNodeAction = any,
> =
    AsyncNodeRM<(L | E | A)>

export type SuspendDriver<
    N = any,
    L extends AnyNodeAction = any,
    E extends AnyNodeAction = any,
    A extends AnyNodeAction = any,
    S extends Action = never
> = {
    [SuspendType]: Driver<N, Suspend<L, E, A>, L | E | A | S>
}

export function suspend<
    L extends AnyNodeAction = any,
    E extends AnyNodeAction = any,
    A extends AnyNodeAction = any,
>(
    loader: NoAsyncNode<L>,
    error: MkError<NoAsyncNode<E>>,
    asyncNode: AsyncNodeMR<A>
): Suspend<L, E, A> {
    return action({
        type: SuspendType,
        loader,
        error,
        asyncNode
    })
}