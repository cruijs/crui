import { Setup } from '../dom';
import { modLifecycle } from '../dom/rendered';
import { AnyTag, Unsubscribe } from '../types';

export function cleanup<T extends AnyTag>(unsub: Unsubscribe): Setup<T> {
    return () => modLifecycle((m) => {
        m.unsub = unsub
    })
}