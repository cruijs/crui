import { Splice } from '../../types';
import { Index, Payload } from '../types';
import { calcIndex } from './calcIndex';
import { filteredList } from './filteredList';

export function handleSplice<T>(upd: Splice<T>, { indexMap, p, $list: $nl }: Payload<T>): Index {
    const index = calcIndex(upd, indexMap)
    const toRemove = calcToRemove(upd, indexMap)
    const rf = filteredList(upd.added, index, p)

    $nl.splice(index, toRemove, rf.filtered)
    indexMap.splice(upd.index, upd.removed.length, ...rf.indexMap)
    fixIndexMap(indexMap)

    return indexMap
}

function calcToRemove<T>(upd: Splice<T>, indexMap: Index): number {
    if (indexMap.length === 0) {
        return 0
    }
    let toRemove = 0
    const last = upd.index + upd.removed.length
    for (let i = upd.index; i < last; ++i) {
        if (indexMap[i] !== undefined) {
            ++toRemove
        }
    }
    return toRemove
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