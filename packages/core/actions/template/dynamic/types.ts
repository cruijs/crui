import { Action } from '../../../types'

export type MakeAction<T, A extends Action> =
    (item: T) => A

export type DynamicR<T> = {
    dynamic: T
}