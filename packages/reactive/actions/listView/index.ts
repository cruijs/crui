import { Action, Driver, NodeAction, Template, UtoI } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { DR$L } from '../../rx/list/types'

export type Tpl<V, N = any> = Template<V, any, N>
export const ListViewType = Symbol('listview')
export type ListViewDriver<
    V extends object,
    E extends Tpl<V, N>,
    N = any,
    S extends Action = never
> = {
    [ListViewType]: Driver<N, ListView<V, E>, E|S, void>
}
export type ListView<V extends object, E extends Template<V>> = 
    NodeAction<
        typeof ListViewType,
        ListViewDriver<V, E> & UtoI<E['_drivers']>,
        UtoI<E['_restriction']>
    > & {
        stream: DR$L<V>,
        template: E
    }

/**
 * Warning: it will take full control over the Node children list!
 */
export function listView<V extends object, E extends Template<V>>(
    stream: DR$L<V>,
    template: E
): ListView<V, E> {
    return action({
        type: ListViewType,
        stream,
        template
    })
}