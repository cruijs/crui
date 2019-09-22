import { Destroyable, ReadStream, WriteStream } from '../types';

export { Destroyable, Effect } from '../types';

/**
 * A destroyable, read-only StreamBox
 */
export type DR$B<T> = ReadStreamBox<T> & Destroyable

/**
 * A destroyable, read-only StreamBox of booleans
 */
export type Cond$B = DR$B<boolean>

/**
 * A read-only stream containing a single value at a time
 */
export interface ReadStreamBox<T> extends ReadStream<T, T> {}
/**
 * Read-only stream box
 */
export type R$B<T> = ReadStreamBox<T>

/**
 * A write stream containing a single value at a time
 */
export interface WriteStreamBox<T> extends WriteStream<T> {}
/**
 * Write StreamBox
 */
export type W$B<T> = WriteStreamBox<T>
/**
 * Destroyabe Write StreamBox
 */
export type DW$B<T> = Destroyable & WriteStreamBox<T>

/**
 * A read-write stream containing a single value at a time
 */
export interface RWStreamBox<T> extends WriteStreamBox<T>, ReadStreamBox<T> {}

/**
 * Read-write stream box
 */
export type RW$B<T> = RWStreamBox<T>
/**
 * Destroyable read-write stream box
 */
export type DRW$B<T> = RW$B<T> & Destroyable