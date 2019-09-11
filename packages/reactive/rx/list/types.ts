import { Destroyable, ReadStream, WriteStream } from '../types';
import { Predicate } from './filter/types';

export { Destroyable, Effect } from '../types';

export enum UpdateType {
    Update,
    Splice,
    Replace,
    Batch
}
export type Update<T> = UpdateItem<T> | Splice<T> | Replace<T> | Batch<T>

export type UpdateItem<T> = {
    type: UpdateType.Update,
    index: number,
    newValue: T,
    oldValue: T
}
export type Splice<T> = {
    type: UpdateType.Splice,
    index: number,
    removed: T[],
    added: T[],
}
export type Replace<T> = {
    type: UpdateType.Replace,
    oldList: T[],
    newList: T[],
}
export type Batch<T> = {
    type: UpdateType.Batch,
    ops: Update<T>[]
}

/**
 * Stream shaped based on a list of elements.
 */
export type R$L<T> = ReadStreamList<T>
export interface ReadStreamList<T> extends ReadStream<T[], Update<T>> {
    /**
     * Returns the i-th element if exists or undefined otherwise
     */
    item(i: number): T|undefined

    /**
     * Filter the internal list and returns the result
     * This method is not meant to be reactive.
     */
    filter(p: Predicate<T>): T[]
    
    /**
     * Map the internal list and retuns the result.
     * This method is not meant to be reactive.
     */
    map<P>(f: (v: T, i: number) => P): P[]

    /**
     * Iterate over all the elements of the internal list.
     * This method is not meant to be reactive.
     */
    forEach(f: (v: T) => void): void
}

/**
 * A read-only StreamList that should be destroyed
 */
export type DR$L<T> = R$L<T> & Destroyable

/**
 * A StreamList that can be modified
 */
export type W$L<T> = WriteStreamList<T>
export interface WriteStreamList<T> extends WriteStream<T[]> {
    /**
     * Modify StreamList by adding and removing elements starting at index
     */
    splice(index: number, delCount: number, added: T[]): T[]

    /**
     * Replace the item at index.
     * @throws Error if `index` is >= list length
     */
    update(index: number, newValue: T): void

    /**
     * Append all items at the end of the StreamList
     */
    concat(items: T[]): void

    /**
     * Append an item at the end of the StreamList
     */
    push(item: T): void

    /**
     * Insert item at i-th position. 
     * The previous i-th item will be pushed to i+1, etc...
     */
    insertAt(i: number, item: T): void

    /**
     * Delete element at `index` position
     */
    deleteAt(i: number): T

    /**
     * Remove item form the StreamList if exists
     */
    remove(item: T): void

    apply(op: Update<T>): void
}

export type RW$L<T> = R$L<T> & W$L<T>
export type ReadWriteStreamList<T> = RW$L<T>

export type DRW$L<T> = RW$L<T> & Destroyable