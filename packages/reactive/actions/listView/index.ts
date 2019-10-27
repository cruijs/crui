import { Action, AnyAction, Driver, Template, UtoI } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { DR$L } from '../../rx/list/types'

export type Tpl<V, N = any> = Template<V, any, any, N>
export const ListViewType = Symbol('listview')
export type ListViewDriver<
    V extends object,
    E extends Tpl<V, N>,
    N = any,
    S extends AnyAction = never
> = {
    [ListViewType]: Driver<N, ListView<V, E>, E|S, void>
}
export type ListView<V extends object, E extends Template<V>> = 
    Action<
        typeof ListViewType,
        ListViewDriver<V, E> & UtoI<E['_drivers']>,
        UtoI<E['_restriction']>,
        void
    > & {
        stream: DR$L<V>,
        template: E
    }

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