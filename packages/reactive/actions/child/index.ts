import { Action, AnyNodeAction, Cleanup, destroyable, Driver, NodeAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { DR$B } from '../../rx/box'
import { Wrap } from '../wrap'

export const $ChildType = Symbol('$child')
export type $ChildDriver<N = any, T = any, E extends AnyNodeAction = never, S extends Action = never> = {
    [$ChildType]: Driver<N, $Child<T, E>, S|E|Cleanup, void>
}

export type $Child<T, E extends AnyNodeAction> = NodeAction<typeof $ChildType, $ChildDriver> & {
    stream: DR$B<T>,
    make: (val: T) => E
    wrap: Wrap
}

export function $child<T, E extends AnyNodeAction>(
    stream: DR$B<T>,
    make: (val: T) => E,
    wrap: Wrap = destroyable
): $Child<T, E> {
    return action({
        type: $ChildType,
        stream,
        make,
        wrap
    })
}