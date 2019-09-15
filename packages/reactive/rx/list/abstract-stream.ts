import { Stream } from '../stream';
import { Predicate } from './filter/types';
import { RW$L, Update, UpdateType } from './types';
import { opReplace, opSplice, opUpdate } from './operations/factory'

export abstract class AbstractStreamList<T> extends Stream<T[], Update<T>> implements RW$L<T>
{
    protected abstract updated(upd: Update<T>): void

    item(i: number): T | undefined {
        return this.value[i]
    }

    set(newList: T[]): void {
        const oldList = this.value
        this.value = newList
        this.updated(opReplace(oldList, newList))
    }

    splice(index: number, delCount: number, added: T[]): T[] {
        if (delCount <= 0 && added.length === 0) {
            return []
        }
        index = Math.min(index, this.value.length)
        const removed = this.value.splice(index, delCount, ...added)
        this.updated(opSplice(index, removed, added))

        return removed
    }

    update(index: number, newValue: T): void {
        if (index >= this.value.length) {
            throw new Error(`Invalid index: ${index}, max ${this.value.length - 1}`)
        }
        const oldValue = this.value[index]
        this.value[index] = newValue
        this.updated(opUpdate(index, oldValue, newValue))
    }

    concat(items: T[]): void {
        this.splice(this.value.length, 0, items)
    }

    push(item: T): void {
        this.concat([item])
    }

    insertAt(i: number, item: T): void {
        this.splice(i, 0, [item])
    }

    deleteAt(i: number): T {
        return this.splice(i, 1, [])[0]
    }

    remove(val: T) {
        const i = this.value.lastIndexOf(val)
        if (i !== -1)
            this.splice(i, 1, [])
    }

    filter(p: Predicate<T>): T[] {
        return this.value.filter(p)
    }

    map<P>(f: (v: T, i: number) => P): P[] {
        return this.value.map(f)
    }

    forEach(f: (v: T) => void) {
        this.value.forEach(f)
    }

    apply(upd: Update<T>): void {
        this.value = updateList(this.value, upd)
        this.updated(upd)
    }
}

function updateList<T>(list: T[], upd: Update<T>): T[] {
    switch (upd.type) {
        case UpdateType.Replace:
            return upd.newList

        case UpdateType.Update:
            list[upd.index] = upd.newValue
            return list

        case UpdateType.Splice:
            list.splice(upd.index, upd.removed.length, ...upd.added)
            return list

        case UpdateType.Batch:
            return upd.ops.reduce(updateList, list)
    }
}