import { Meta, Setup } from '@crui/core/dom';
import { modLifecycle, result } from '@crui/core/dom/rendered';
import { Signal } from '../rx/signal';

type Tag = 'input'|'textarea'|'select'
export function focus<T extends Tag>(signal: Signal): Setup<{}, Meta<T>> {
    return (meta, dom, node) => {
        return result(meta, modLifecycle((l) => {
            l.unsub = signal.subscribe(() => {
                dom.setFocus(node)
            })
        }))
    }
}