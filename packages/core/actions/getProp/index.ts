import { Props } from '../../dom'
import { TagR } from '../../restrictions/tag'
import { Driver, InfraAction } from '../../types'
import { action } from '../action'

export const GetPropType = Symbol('getProp')
export type GetPropDriver<K extends keyof Props, N = any> = {
    [GetPropType]: Driver<N, GetProp<K>, never, Props[K]>
}
export type GetProp<K extends keyof Props> = 
    InfraAction<typeof GetPropType, GetPropDriver<K>, TagR, Props[K]> & {
        name: K
    }

export function getProp<K extends keyof Props>(name: K): GetProp<K> {
    return action({
        type: GetPropType,
        name
    })
}