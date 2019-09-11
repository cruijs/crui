import { opSplice } from '../../operations/factory';
import { Splice, Update } from '../../types';
import { Index, Payload } from '../types';
import { calcIndex } from './calcIndex';
import { filteredList } from './filteredList';

export function handleSplice<T>({ indexMap, p }: Payload<T>, upd: Splice<T>): Update<T> {
    const index = calcIndex(upd, indexMap)
    const toRemove = upd.removed.filter(p)
    const rf = filteredList(upd.added, index, p)

    indexMap.splice(upd.index, upd.removed.length, ...rf.indexMap)
    fixIndexMap(indexMap)

    return opSplice(index, toRemove, rf.filtered)
}

function fixIndexMap(indexMap: Index) {
    let prev = -1
    for (let i = 0; i < indexMap.length; ++i) {
        const n = indexMap[i];
        if (n !== undefined) {
            indexMap[i] = ++prev
        }
    }
}