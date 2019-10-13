import { Tag } from '../../../../core/types'
import { Action, Driver } from '../../types'
import { action } from '../action'

export const CreateTagType = Symbol('create-tag')
export type CreateTagDriver<N = any> = {
    [CreateTagType]: Driver<N, CreateTag<N>>
}

export type CreateTag<N = any> =
    Action<
        typeof CreateTagType,
        CreateTagDriver,
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