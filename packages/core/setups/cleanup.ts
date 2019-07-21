import { Setup, Unsubscribe } from '../dom';
import { modLifecycle, result } from '../dom/rendered';

/**
 * Run the provided cleanup function once the Component is disposed
 */
export function cleanup<M>(unsub: Unsubscribe): Setup<{}, M> {
    return (meta) => result(meta, modLifecycle((m) => {
        m.unsub = unsub
    }))
}