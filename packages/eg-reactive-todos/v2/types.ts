import { Emitter } from './emitter'
import { Deferred } from './deferred'

export type Driver<N, A extends AnyAction, S extends AnyAction = AnyAction, R = N> =
    (node: N, action: A, emitter: Emitter<N, S>) => R|Deferred<R>

export type Drivers<N = any, R = N> = {
    [k: string]: Driver<N, AnyAction, AnyAction, R>
}

export type Action<T extends symbol, D extends Drivers<any, DR>, R = {}, DR = any> = {
    readonly type: T
    _r: R,
    _d: D,
    _dr: DR,
}

export type AnyAction = Action<any, any, any, any>