import { AnyNodeAction, Driver, NodeAction } from '../../../types'
import { action } from '../../action'
import { EmptyNode } from '../../emptyNode'
import { DynamicR, MakeAction } from './types'

export const DynamicNodeType = Symbol('dynNode')
export type DynamicNodeDriver<
    N,
    T = any,
    A extends AnyNodeAction = any
> = {
    [DynamicNodeType]: Driver<N, DynamicNode<T, A>, EmptyNode<N>, N>
}
export type DynamicNode<T, A extends AnyNodeAction> = NodeAction<
    typeof DynamicNodeType,
    DynamicNodeDriver<any, T, A> & A['_drivers'],
    DynamicR<T> & A['_restriction'],
    A['_return']
> & {
    make: MakeAction<T, A>
}

export function dynNode<T, A extends AnyNodeAction>(
    make: MakeAction<T, A>
): DynamicNode<T, A> {
    return action({
        type: DynamicNodeType,
        make
    })
}