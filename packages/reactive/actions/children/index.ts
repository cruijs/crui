import { Action, Driver } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { R$L } from '../../rx/list/types'

export const $ChildrenType = Symbol('$children')
export type $ChildrenDriver<N = any, S extends Action = never> = {
    [$ChildrenType]: Driver<N, $Children<N>, S>
}
export type $Children<N> = Action<typeof $ChildrenType, $ChildrenDriver<N>> & {
    stream: R$L<N>
}

export function $children<N>(
    stream: R$L<N>
): $Children<N> {
    return action({
        type: $ChildrenType,
        stream
    })
}