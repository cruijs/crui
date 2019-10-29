import { Props } from '../../dom'
import { TagR } from '../../restrictions/tag'
import { Action, Driver } from '../../types'
import { action } from '../action'

export const PropType = Symbol('prop')
export type PropDriver<N = any, K extends keyof Props = any> = {
    [PropType]: Driver<N, Prop<K>>
}
export type Prop<K extends keyof Props> = Action<typeof PropType, PropDriver<any, K>, TagR> & {
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