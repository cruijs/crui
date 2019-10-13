import { Deferred } from './deferred'
import { Emitter } from './emitter'

export type Driver<N, A extends AnyAction, S extends AnyAction = AnyAction, R = N> =
    (node: N, action: A, emitter: Emitter<N, S>) => R | Deferred<R>

export type Drivers<N = any, R = N> = {
    [k: string]: Driver<N, AnyAction, AnyAction, R>
}

/**
 * Transform Union into Intersection
 * 
 * Example:
 *   UtoI<A | B | C> := A & B & C
 */
export type UtoI<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

export type Action<
    T extends symbol,
    D extends Drivers<any, DR>,
    RP = {},
    DR = any,
> = {
    readonly type: T
    _restriction: RP,
    _drivers: D,
    _return: DR,
}
export type AnyAction = Action<any, any, any, any>

export type MatchRestr<R, A> =
    A extends Action<any, any, infer MR>
        ? R extends Pick<MR, Extract<keyof MR, keyof R>> ? A : never
        : never

export type RemoveRestr<R, A> =
    A extends Action<any, any, infer MR>
        ? Pick<MR, Exclude<keyof MR, keyof R>>
        : never