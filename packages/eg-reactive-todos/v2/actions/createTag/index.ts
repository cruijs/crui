import { Tag } from '../../../../core/types'
import { Action, Driver } from '../../types'

export const CreateTagType = Symbol('create-tag')
export type CreateTagDriver<N = any> = {
    [CreateTagType]: Driver<N, CreateTag<N>>
}

export type CreateTag<N = any> =
    Action<
        typeof CreateTagType,
        CreateTagDriver,
        {},
        N
    > & {
        tag: Tag
    }

export function createTag(tag: Tag): CreateTag {
    return {
        type: CreateTagType,
        tag,
        _r: 0 as any,
        _d: 0 as any,
        _dr: 0 as any,
    }
}