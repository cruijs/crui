import { AnyAction } from '../types';

export function action<P>(payload: P): AnyAction & P {
    return payload as any
}