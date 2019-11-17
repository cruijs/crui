import { Action, AnyNodeAction, Driver, DynamicMR, DynamicRM, NodeAction, UtoI } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { R$L } from '../../rx/list/types'

export const ListViewType = Symbol('listview')
export type ListViewDriver<
    N,
    V extends object = any,
    E extends AnyNodeAction = any,
    S extends Action = never
> = {
    [ListViewType]: Driver<N, ListView<V, E>, E|S, void>
}
export type ListView<V extends object, E extends AnyNodeAction> = 
    NodeAction<
        typeof ListViewType,
        ListViewDriver<any, V, E> & UtoI<E['_drivers']>,
        UtoI<DynamicRM<V, E>>
    > & {
        stream: R$L<V>,
        template: E
    }

/**
 * Warning: it will take full control over the Node children list!
 */
export function listView<V extends object, E extends AnyNodeAction>(
    stream: R$L<V>,
    template: DynamicMR<V, E>
): ListView<V, E> {
    return action({
        type: ListViewType,
        stream,
        template
    })
}