import { Destroyable, ReadStream, RWStream } from '../types';

export { Destroyable, Effect } from '../types';

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
export interface ROStreamBox<T> extends ReadStream<T, T> {
}
/**
 * Read-only stream box
 */
export type R$B<T> = ROStreamBox<T>

/**
 * A read-write stream containing a single value at a time
 */
export interface RWStreamBox<T> extends RWStream<T, T>, ROStreamBox<T> {}

/**
 * Read-write stream box
 */
export type RW$B<T> = RWStreamBox<T>
/**
 * Destroyable read-write stream box
 */
export type DRW$B<T> = RW$B<T> & Destroyable