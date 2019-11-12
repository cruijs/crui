import { MatchRestr, RemoveRestr, NoRestr } from '@crui/core/types'

export type AsyncNodeR = {
    asyncNode: true
}

export type AsyncNodeMR<A> =
    MatchRestr<AsyncNodeR, A>

export type AsyncNodeRM<A> =
    RemoveRestr<AsyncNodeR, A>

export type NoAsyncNode<A> =
    NoRestr<AsyncNodeR, A>
