import { Splice } from '..';
import { filteredList } from "./filteredList";
import { Index, Payload } from './types';
import { updateIndex } from "./updateIndex";

export function handleSplice<T>(upd: Splice<T>, { indexMap, p, $nl }: Payload<T>): Index {
    const index = calcIndex(upd, indexMap);
    const remLen = upd.removed.length;
    const toRemove = calcToRemove(upd, indexMap);

    if (toRemove && remLen) {
        updateIndex(indexMap, upd.index + remLen - 1, (n) => n - toRemove);
    }

    const rf = filteredList(upd.added, p);
    const inc = rf.filtered.length;
    debugger;
    updateIndex(rf.indexMap, -1, (n) => n + index);
    indexMap.splice(upd.index, remLen, ...rf.indexMap);

    if (inc > 0) {
        updateIndex(indexMap, upd.index + upd.added.length - 1, (n) => n + inc);
    }

    $nl.splice(index, toRemove, rf.filtered);
    return indexMap;
}

function calcIndex<T>(upd: Splice<T>, indexMap: Index): number {
    if (indexMap.length === 0) {
        return 0
    }
    let n: number|undefined
    const last = upd.index + upd.removed.length
    for (let i = upd.index; i <= last; ++i) {
        n = indexMap[i]
        if (n != null) {
            return n
        }
    }
    for (let i = last; i < indexMap.length; ++i) {
        n = indexMap[i]
        if (n != null) {
            return n - 1
        }
    }
    for (let i = upd.index; i > 0; --i) {
        n = indexMap[i]
        if (n != null) {
            return n + 1
        }
    }
    return 0
}

function calcToRemove<T>(upd: Splice<T>, indexMap: Index): number {
    if (indexMap.length === 0) {
        return 0
    }
    let toRemove = 0
    const last = upd.index + upd.removed.length
    for (let i = upd.index; i < last; ++i) {
        if (indexMap[i] != null) {
            ++toRemove
        }
    }
    return toRemove
}