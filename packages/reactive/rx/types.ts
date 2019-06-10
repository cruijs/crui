import { Unsubscribe } from '@crui/core/type'
export type Effect<U> = (upd: U) => void

/**
 * Read-only Stream
 */
export interface ReadStream<T, U> {
    get(): T
    subscribe(eff: Effect<U>): Unsubscribe
    addUnsub(unsub: Unsubscribe): void
}

/**
 * Write-only Stream
 */
export interface WriteStream<T> {
    set(val: T): void
}

/**
 * A read-write stream
 */
export interface RWStream<T, U> extends ReadStream<T, U>, WriteStream<T> {}

/**
 * Something that should be destroyed
 */
export interface Destroyable {
    destroy(): void
}