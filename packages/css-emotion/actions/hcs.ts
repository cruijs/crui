import { h } from '@crui/core/actions/elem'
import { Tag } from '@crui/core/restrictions'
import { AnyNodeAction } from '@crui/core/types'
import { css, CssStyle } from './css'

export function hcs<T extends Tag, C extends AnyNodeAction, S = undefined>(
    tag: T,
    style: CssStyle<S>,
    children: C[]
) {
    return h(tag, [css(style)], children)
}