import { Tag } from '../restrictions/tag'
import { hc } from './elem'
import { text } from './text'

export function ht<T extends Tag>(tag: T, data: string) {
    return hc(tag, [
        text(data)
    ])
}