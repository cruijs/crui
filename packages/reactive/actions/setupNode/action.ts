import { action } from '@crui/core/actions/action'
import { Action, AnyNodeAction, AnySetupAction, Driver, NodeAction } from '@crui/core/types'
import { NoMorphingR } from '../../restrictions/morphing'

export const SetupNodeType = Symbol('setupNode')
export type SetupNode<E extends AnyNodeAction, A extends AnySetupAction> = 
    NodeAction<
        typeof SetupNodeType,
        SetupNodeDriver
    > & {
        elem: E
        setups: A[]
    }

export type SetupNodeDriver<
    N = any,
    E extends AnyNodeAction = any,
    A extends AnySetupAction = any,
    S extends Action = never
> = {
    [SetupNodeType]: Driver<N, SetupNode<E, A>, S | E | A>
}

export function setupNode<E extends AnyNodeAction, A extends AnySetupAction>(
    elem: NoMorphingR<E>,
    setups: A[]
): SetupNode<E, A> {
    return action({
        type: SetupNodeType,
        elem,
        setups
    })
}