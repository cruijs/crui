import { TagR } from '../../restrictions/tag';
import { Action, Driver } from '../../types';
import { action } from '../action';

type DomStyle = Pick<
    CSSStyleDeclaration,
    Exclude<keyof CSSStyleDeclaration, 'length'|'parentRule'>
>
type KS = keyof DomStyle
type PS<K extends KS> = Pick<DomStyle, K>

export const StyleType = Symbol('style')
export type StyleDriver<N = any> = {
    [StyleType]: Driver<N, Style>
}
export type Style<K extends KS = KS> = Action<typeof StyleType, StyleDriver, TagR> & {
    name: K,
    value: PS<K>,
}

export function style<K extends KS>(name: K, value: PS<K>): Style<K> {
    return action({
        type: StyleType,
        name,
        value,
    })
}