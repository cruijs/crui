import { Action, Driver, NodeAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { DR$B } from '../../rx/box'

export const $TextType = Symbol('$text')
export type $TextDriver<N = any,  S extends Action = never> = {
    [$TextType]: Driver<N, $TextElem, S>
}
export type $TextElem =
    NodeAction<
        typeof $TextType,
        $TextDriver
    > & {
        stream: DR$B<string>
    }

export function $text(stream: DR$B<string>): $TextElem {
    return action({
        type: $TextType,
        stream,
    })
}