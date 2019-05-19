import { combine2 } from '@crui/core/utils/combine';
import { noop } from '@crui/core/utils/noop';

export type Effect<U> = (upd: U) => void
export type Unsubscribe = () => void

export abstract class Stream<T, U = T> {
    protected value: T
    private listeners: Effect<U>[]
    private unsub: Unsubscribe

    constructor(val: T) {
        this.value = val
        this.listeners = []
        this.unsub = noop
    }

    abstract set(val: T): void

    get() {
        return this.value
    }

    subscribe(eff: Effect<U>): Unsubscribe {
        this.listeners.push(eff)
        return () => {
            const index = this.listeners.indexOf(eff)
            if (index !== -1) {
                this.listeners.splice(index, 1)
            }
        }
    }

    /**
     * Clear all listeners and unsubscribe from upstream.
     * 
     * Call this method when the stream is not needed anymore to avoid memory 
     * leaks.
     */
    destroy = () => {
        this.unsub()
        this.listeners = []
    }

    /** This function is useful for derived Streams */
    addUnsub(f: Unsubscribe) {
        this.unsub = combine2(this.unsub, f)
    }

    protected notify(upd: U): void {
        this.listeners.forEach((eff) => {
            eff(upd)
        })
    }
}