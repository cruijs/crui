import { Action, MatchRestr, RemoveRestr } from '../../../types'

export type MakeAction<T, A extends Action> =
    (item: T) => A

export type DynamicR<T> = {
    dynamic: T
}

export type DynamicMR<T, A> =
    MatchRestr<DynamicR<T>, A>

export type DynamicRM<T, A> =
    RemoveRestr<DynamicR<T>, A>