import { BaseStream } from '../base';
import { Predicate } from './filter/types';

export enum UpdateType {
    Update,
    Splice,
    Replace,
}
export type Update<T> = UpdateItem<T> | Splice<T> | Replace<T>
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

export class StreamList<T> extends BaseStream<T[], Update<T>>{
    replace(newList: T[]): void {
        const oldList = this.value
        this.value = newList
        this.notify({ type: UpdateType.Replace, newList, oldList })
    }

    splice(index: number, delCount: number, added: T[]): T[] {
        if (delCount <= 0 && added.length === 0) {
            return []
        }
        index = Math.min(index, this.value.length)
        const removed = this.value.splice(index, delCount, ...added)
        this.notify({ type: UpdateType.Splice, index, removed, added })
        return removed
    }

    update(index: number, newValue: T): void {
        if (index >= this.value.length) {
            throw new Error(`Invalid index: ${index}, max ${this.value.length-1}`)
        }
        const oldValue = this.value[index]
        this.value[index] = newValue
        this.notify({ type: UpdateType.Update, index, oldValue, newValue })
    }

    concat(items: T[]): void {
        this.splice(this.value.length, 0, items)
    }

    push(item: T): void {
        this.concat([item])
    }

    filter(p: Predicate<T>): T[] {
        return this.value.filter(p)
    }

    map<P>(f: (v: T) => P): P[] {
        return this.value.map(f)
    }

    forEach(f: (v: T) => void) {
        this.value.forEach(f)
    }
}