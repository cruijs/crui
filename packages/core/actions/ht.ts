import { Tag } from '../restrictions/tag'
import { h } from './elem'
import { text } from './text'

export function ht<T extends Tag>(tag: T, data: string) {
    return h(tag, [
        text(data)
    ])
}