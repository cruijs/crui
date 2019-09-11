import { Batch, Replace, Splice, Update, UpdateItem, UpdateType } from '../types'

export function opBatch<T>(ops: Update<T>[]): Batch<T> {
    return {
        type: UpdateType.Batch,
        ops
    }
}

export function opReplace<T>(oldList: T[], newList: T[]): Replace<T> {
    return {
        type: UpdateType.Replace,
        oldList,
        newList
    }
}

export function opUpdate<T>(index: number, oldValue: T, newValue: T): UpdateItem<T> {
    return {
        type: UpdateType.Update,
        index,
        oldValue,
        newValue
    }
}

export function opRemove<T>(index: number, removed: T[]): Splice<T> {
    return opSplice(index, removed, [])
}

export function opAdd<T>(index: number, added: T[]): Splice<T> {
    return opSplice(index, [], added)
}

export function opSplice<T>(index: number, removed: T[], added: T[]): Splice<T> {
    return {
        type: UpdateType.Splice,
        index,
        removed,
        added
    }
}
