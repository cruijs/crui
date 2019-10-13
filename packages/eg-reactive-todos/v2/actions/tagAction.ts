import { Tag } from '@crui/core/dom'
import { Action } from '../types'

export type TagR = {
    tag: Tag
}

export type TagAction<R = any> = Action<any, any, TagR, R>