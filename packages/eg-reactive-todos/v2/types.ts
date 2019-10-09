import { Emitter } from './emitter'
import { Deferred } from './deferred'

export type Driver<N, A extends AnyAction, S extends AnyAction> =
    (node: N, action: A, emitter: Emitter<N, S>) => N|Deferred<N>

export type Drivers<N = any> = {
    [k: string]: Driver<N, AnyAction, AnyAction>
}

export type Action<T extends symbol, D extends Drivers, R = {}> = {
    readonly type: T
    _r: R,
    _d: D
}

export type AnyAction = Action<any, any, any>