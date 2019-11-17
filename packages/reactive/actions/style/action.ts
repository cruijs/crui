import { Action, Driver, SetupAction } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { StyleK, StyleP } from '@crui/core/dom/style'
import { DR$B } from '../../rx/box/types'

export const $StyleType = Symbol('$style')
export type $Style<K extends StyleK = any, V extends StyleP<K> = any> = SetupAction<
    typeof $StyleType,
    $StyleDriver
> & {
    name: K,
    stream: DR$B<V>
}

export type $StyleDriver<N = any, K extends StyleK = any, S extends Action = never> = {
    [$StyleType]: Driver<N, $Style<K, StyleP<K>>, S>
}

export function $style<K extends StyleK>(name: K, stream: DR$B<StyleP<K>>): $Style<K> {
    return action({
        type: $StyleType,
        name,
        stream,
    })
}