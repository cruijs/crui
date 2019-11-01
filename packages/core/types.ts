import { Emitter } from './scheduler/emitter'

export type Driver<N, A extends Action, S extends Action = never, R = void> =
    (node: N, action: A, emitter: Emitter<N, S>) => R

export type Drivers<N = any, R = N> = {
    [k: string]: Driver<N, any, any, R>
}

/**
 * Transform Union into Intersection
 * 
 * Example:
 *   UtoI<A | B | C> := A & B & C
 */
export type UtoI<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

type ActionKind = 'setup'|'node'|'infra'
export type Action<
    T extends symbol = any,
    D extends Drivers<any, DR> = any,
    RP = any,
    DR = any,
    K extends ActionKind = any
> = {
    readonly type: T
    _restriction: RP,
    _drivers: D,
    _return: DR,
    _kind: K
}

export type InfraAction<
    T extends symbol,
    D extends Drivers<any, DR>,
    RP = {},
    DR = void
> = Action<T, D, RP, DR, 'infra'>

export type SetupAction<
    T extends symbol,
    D extends Drivers<any, DR>,
    RP = {},
    DR = void
> = Action<T, D, RP, DR, 'setup'>

export type AnySetupAction =
    SetupAction<any, any, any, any>

export type NodeAction<
    T extends symbol,
    D extends Drivers<any, DR> = any,
    DR = any,
    RP = {},
> = Action<T, D, RP, DR, 'node'>

export type AnyNodeAction<N = any> = NodeAction<any, any, N, any>

export type MatchRestr<R, A> =
    A extends Action<any, any, infer MR, any, any>
        ? R extends Pick<MR, Extract<keyof MR, keyof R>> ? A : never
        : never 

export type RemoveRestr<R, A> =
    A extends Action<any, any, infer MR, any, any>
        ? Pick<MR, Exclude<keyof MR, keyof R>>
        : never

export type ProvideDriver<D, A> =
    A extends Action<any, infer DR, any>
        ? Pick<DR, Exclude<keyof DR, keyof D>>
        : never

export type Unsubscribe = () => void
export type AsyncFn = () => PromiseLike<void>