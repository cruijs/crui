import { Tag } from '@crui/core/dom'
import { Action } from '../types'

export type TagR = {
    tag: Tag
}

export type TagAction = Action<any, any, TagR>