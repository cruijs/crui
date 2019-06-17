import { Setup } from '../dom';
import { modLifecycle, result } from '../dom/rendered';
import { Unsubscribe } from '../types';

/**
 * Run the provided cleanup function once the Component is disposed
 */
export function cleanup(unsub: Unsubscribe): Setup {
    return (meta) => result(meta, modLifecycle((m) => {
        m.unsub = unsub
    }))
}