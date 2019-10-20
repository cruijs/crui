import { Tag } from '@crui/core/types'
import { DR$L } from '@crui/reactive/rx/list'
import { Action, AnyAction, Driver, UtoI } from '../../types'
import { action } from '../action'
import { Template } from '../template'

type Tpl<T, N = any> = Template<Tag, AnyAction, T, N>
export const ListViewType = Symbol('listview')
export type ListViewDriver<
    T extends object,
    E extends Tpl<T, N>,
    N = any,
    S extends AnyAction = never
> = {
    [ListViewType]: Driver<N, ListView<T, E>, E|S, void>
}
export type ListView<T extends object, E extends Tpl<T>> = 
    Action<
        typeof ListViewType,
        ListViewDriver<T, E> & UtoI<E['_drivers']>,
        UtoI<E['_restriction']>,
        void
    > & {
        stream: DR$L<T>,
        template: E
    }

export function listView<T extends object, E extends Tpl<T>>(
    stream: DR$L<T>,
    template: E
): ListView<T, E> {
    return action({
        type: ListViewType,
        stream,
        template
    })
}