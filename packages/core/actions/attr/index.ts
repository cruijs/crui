import { TagR } from '../../restrictions/tag'
import { Action, Driver } from '../../types'
import { action } from '../action'

export const AttrType = Symbol('attr')
export type AttrDriver<N = any> = {
    [AttrType]: Driver<N, Attr>
}
export type Attr = Action<typeof AttrType, AttrDriver, TagR> & {
    name: string,
    value: string,
}

export function attr(name: string, value: string): Attr {
    return action({
        type: AttrType,
        name,
        value,
    })
}