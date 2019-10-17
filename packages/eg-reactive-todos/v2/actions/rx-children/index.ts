import { R$L } from '@crui/reactive/rx/list'
import { Action, AnyAction, Driver } from '../../types'
import { action } from '../action'

export const $ChildrenType = Symbol('$children')
export type $ChildrenDriver<N = any, S extends AnyAction = AnyAction> = {
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