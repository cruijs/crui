import { Action, Driver } from '../../types'
import { action } from '../action'
import { TagR } from '../tagAction'

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