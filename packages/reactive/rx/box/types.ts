import { Unsubscribe } from '@crui/core/type';
import { Destroyable, Effect, ReadStream, Stream } from '../types';

/**
 * A destroyable, read-only StreamBox
 */
export type DR$B<T> = ROStreamBox<T> & Destroyable

/**
 * A destroyable, read-only StreamBox of booleans
 */
export type Cond$B = DR$B<boolean>

/**
 * A read-only stream containing a single value at a time
 */
export type R$B<T> = ROStreamBox<T>
export interface ROStreamBox<T> extends ReadStream<T> {
    apply(eff: Effect<T>): Unsubscribe
}

/**
 * A read-write stream containing a single value at a time
 */
export type RW$B<T> = StreamBox<T>
export interface StreamBox<T> extends Stream<T>, ROStreamBox<T> {}
export type DRW$B<T> = RW$B<T> & Destroyable