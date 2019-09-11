import { opAdd, opNoop, opRemove, opUpdate } from '../../operations/factory';
import { Update, UpdateItem } from '../../types';
import { Index, Payload } from '../types';
import { updateIndex } from './updateIndex';

export function handleUpdate<T>({ indexMap, p }: Payload<T>, upd: UpdateItem<T>): Update<T> {
    const i = indexMap[upd.index]
    const matches = p(upd.newValue, upd.index)
    // no changes
    if (matches === false && i == null) {
        return opNoop
    }
    // change in place
    if (matches && i != null) {
        return opUpdate(i, upd.oldValue, upd.newValue)
    }
    // remove
    if (matches === false && i != null) {
        indexMap[upd.index] = undefined
        updateIndex(indexMap, upd.index, (n) => n - 1)
        return opRemove(i, [upd.oldValue])
    }
    // add
    const j = closestIndex(upd.index, indexMap)
    indexMap[upd.index] = j
    updateIndex(indexMap, upd.index, (n) => n + 1)
    return opAdd(j, [upd.newValue])
}

function closestIndex(index: number, indexMap: Index): number {
    for (let j, i = index; i < indexMap.length; ++i) {
        j = indexMap[i]
        if (j != null) {
            return j
        }
    }
    // find the last one
    for (let j, i = index; i > 0; --i) {
        j = indexMap[i]
        if (j != null) {
            return j + 1
        }
    }
    // empty list
    return 0
}