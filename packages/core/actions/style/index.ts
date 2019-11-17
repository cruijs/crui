import { StyleK, StyleP } from '../../dom/style';
import { Driver, SetupAction } from '../../types';
import { action } from '../action';

export const StyleType = Symbol('style')
export type StyleDriver<N = any> = {
    [StyleType]: Driver<N, Style>
}
export type Style<K extends StyleK = any> = SetupAction<typeof StyleType, StyleDriver> & {
    name: K,
    value: StyleP<K>,
}

export function style<K extends StyleK>(name: K, value: StyleP<K>): Style<K> {
    return action({
        type: StyleType,
        name,
        value,
    })
}