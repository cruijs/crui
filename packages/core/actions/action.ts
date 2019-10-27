import { AnyAction } from '../types';

type Typed = {
    type: symbol
}
export function action<P extends Typed>(payload: P): AnyAction & P {
    return payload as any
}