import { Tag } from '@crui/core/dom'
import { Action } from '../types'

export type TagR<T extends Tag = Tag> = {
    tag: T
}

export type TagAction<T extends Tag = Tag, DR = any> = Action<any, any, DR, TagR<T>>