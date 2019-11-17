import { AnyNodeAction, AnySetupAction } from '@crui/core/types';
import { bind, constMap, waitAll } from '@crui/core/utils/deferred';
import { SetupNodeDriver, SetupNodeType } from './action';

export const makeSetupNodeDriver = <
    N,
    E extends AnyNodeAction = any,
    A extends AnySetupAction = any
>(): SetupNodeDriver<N, E, A> => ({
    [SetupNodeType]: (_, { elem, setups }, { emit }) => (
        bind(
            emit(_, elem),
            (node) => constMap(
                node,
                waitAll(setups.map((a) => emit(node, a)))
            )
        )
    )
})