import { Action, Driver, SetupAction, TagR } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { Props } from '@crui/core/dom'
import { DR$B } from '../../rx/box'

export const $PropType = Symbol('$prop')
export type $PropDriver<N = any, K extends keyof Props = any, S extends Action = never> = {
    [$PropType]: Driver<N, $Prop<K>, S>
}
export type $Prop<K extends keyof Props> = SetupAction<typeof $PropType, $PropDriver<any, K>, TagR> & {
    name: K
    stream: DR$B<Props[K]>
}

export function $prop<K extends keyof Props>(name: K, stream: DR$B<Props[K]>): $Prop<K> {
    return action({
        type: $PropType,
        name,
        stream,
    })
}