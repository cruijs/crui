import { Unsubscribe } from '@crui/core/type'
export type Effect<U> = (upd: U) => void

/**
 * Read-only Stream
 */
export type R$<T, U = T> = ReadStream<T, U>
export interface ReadStream<T, U = T> {
    get(): T
    subscribe(eff: Effect<U>): Unsubscribe
    addUnsub(unsub: Unsubscribe): void
}

/**
 * Write-only Stream
 */
export type W$<T> = WriteStream<T>
export interface WriteStream<T> {
    set(val: T): void
}

/**
 * A read-write stream
 */
export type RW$<T, U = T> = Stream<T, U>
export interface Stream<T, U = T> extends ReadStream<T, U>, WriteStream<T> {}

/**
 * Something that should be destroyed
 */
export interface Destroyable {
    destroy(): void
}

/**
 * A destroyable stream of booleans
 */
export type Cond$ = ReadStream<boolean> & Destroyable

/**
 * Destroyable, read-only stream
 */
export type DR$<T, U = T> = ReadStream<T, U> & Destroyable
export type DRW$<T, U = T> = DR$<T, U> & W$<T>