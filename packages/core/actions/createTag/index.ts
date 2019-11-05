import { Tag } from '../../restrictions/tag'
import { Driver, NodeAction } from '../../types'
import { action } from '../action'

export const CreateTagType = Symbol('create-tag')
export type CreateTagDriver<N = any> = {
    [CreateTagType]: Driver<N, CreateTag<N>>
}

export type CreateTag<N = any> =
    NodeAction<
        typeof CreateTagType,
        CreateTagDriver,
        {},
        N
    > & {
        tag: Tag
    }

export function createTag(tag: Tag): CreateTag {
    return action({
        type: CreateTagType,
        tag,
    })
}