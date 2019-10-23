import { Tag } from '@crui/core/dom'
import { AnyAction, MatchRestr } from '../types'

export type TagR<T extends Tag = Tag> = {
    tag: T
}

export type TagMR<A extends AnyAction, T extends Tag = Tag> =
    MatchRestr<TagR<T>, A>