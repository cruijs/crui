import { Setup } from '../dom';
import { modLifecycle, result } from '../dom/rendered';
import { Unsubscribe } from '../types';

export function cleanup<C, M>(unsub: Unsubscribe): Setup<C, M> {
    return (meta) => result(meta, modLifecycle((m) => {
        m.unsub = unsub
    }))
}