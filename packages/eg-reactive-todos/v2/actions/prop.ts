import { Props } from '../../../core/dom/props'
import { Tag } from '../../../core/types'

export const PropType = Symbol('prop')
export type PropDriver = {
    [PropType]: Driver<Prop<any>, TagR>
}
type Prop<K extends keyof Props> = Action<typeof PropType, PropDriver, TagR> & {
    name: K
    value: Props[K]
}

export function prop<K extends keyof Props>(name: K, value: Props[K]): Prop<K> {
    return {
        type: PropType,
        name,
        value,
        _r: 0 as any,
        _d: 0 as any,
    }
}

export const AttrType = Symbol('attr')
export type AttrDriver = {
    [AttrType]: Driver<Attr, TagR>
}
type Attr = Action<typeof AttrType, AttrDriver, TagR> & {
    name: string,
    value: string,
}

export function attr(name: string, value: string): Attr {
    return {
        type: AttrType,
        name,
        value,
        _r: 0 as any,
        _d: 0 as any,
    }
}

export const x = h('div', [
    prop('className', 'test'),
    prop('tabIndex', -1),
    child('span', [
        prop('className', 'child'),
        attr('test', 'er'),
    ])
])