import { Tag } from '@crui/core/types';
import { h } from './elem'
import { text } from './text/index'

export function ht<T extends Tag>(tag: T, data: string) {
    return h(tag, [
        text(data)
    ])
}