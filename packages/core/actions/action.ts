import { Action } from '../types'

type Typed<T extends symbol> = {
    type: T
}
export function action<T extends symbol, P extends Typed<T>>(payload: P): Action<T> & P {
    return payload as any
}