import { Action, AnyNodeAction, Cleanup, Driver, NodeAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { DR$B } from '../../rx/box'

export const $ChildType = Symbol('$child')
export type $ChildDriver<N = any, E extends AnyNodeAction = never, S extends Action = never> = {
    [$ChildType]: Driver<N, $Child<E>, S|E|Cleanup, void>
}
export type $Child<E extends AnyNodeAction> = NodeAction<typeof $ChildType, $ChildDriver> & {
    stream: DR$B<E>,
}

export function $child<E extends AnyNodeAction>(stream: DR$B<E>): $Child<E> {
    return action({
        type: $ChildType,
        stream,
    })
}