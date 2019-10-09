import { Tag } from '../../../core/types'
import { Action, Driver } from '../types'

export const CreateTagType = Symbol('create-tag')
export type CreateTagDriver<N> = {
    create: Driver<CreateTag<N>, {}>
}
export type CreateTag<N> =
    Action<
        typeof CreateTagType,
        CreateTagDriver<N>,
        {}
    > & {
        tag: Tag
    }

export function createTag<N>(tag: Tag): CreateTag<N> {
    return {
        type: CreateTagType,
        tag,
        _r: 0 as any,
        _d: 0 as any,
    }
}