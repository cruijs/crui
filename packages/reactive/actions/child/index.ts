import { Action, AnyNodeAction, Cleanup, destroyable, Driver, NodeAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { DR$B } from '../../rx/box'
import { Wrap } from '../wrap'

export const $ChildType = Symbol('$child')
export type $ChildDriver<N = any, E extends AnyNodeAction = never, S extends Action = never> = {
    [$ChildType]: Driver<N, $Child<E>, S|E|Cleanup, void>
}

export type $Child<E extends AnyNodeAction> = NodeAction<typeof $ChildType, $ChildDriver> & {
    stream: DR$B<E>,
    wrap: Wrap
}

export function $child<E extends AnyNodeAction>(
    stream: DR$B<E>,
    wrap: Wrap = destroyable
): $Child<E> {
    return action({
        type: $ChildType,
        stream,
        wrap
    })
}