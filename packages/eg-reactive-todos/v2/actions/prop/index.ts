import { Props } from '@crui/core/dom'
import { Action, Driver } from '../../types'
import { action } from '../action'
import { TagR } from '../tagAction'

export const PropType = Symbol('prop')
export type PropDriver<N = any> = {
    [PropType]: Driver<N, Prop<any>>
}
type Prop<K extends keyof Props> = Action<typeof PropType, PropDriver, TagR> & {
    name: K
    value: Props[K]
}

export function prop<K extends keyof Props>(name: K, value: Props[K]): Prop<K> {
    return action({
        type: PropType,
        name,
        value,
    })
}