import { DR$L } from '@crui/reactive/rx/list'
import { Action, AnyAction, Driver, UtoI } from '../../types'
import { action } from '../action'
import { Template } from '../template'

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