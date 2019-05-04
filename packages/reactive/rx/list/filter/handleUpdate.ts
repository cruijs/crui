import { UpdateItem } from '..';
import { Index, Payload } from './types';
import { updateIndex } from "./updateIndex";

export function handleUpdate<T>(upd: UpdateItem<T>, { p, $nl, indexMap }: Payload<T>): Index {
    const i = indexMap[upd.index];
    const matches = p(upd.newValue);
    // no changes
    if (matches === false && i == null) {
        return indexMap;
    }
    // change in place
    if (matches && i != null) {
        $nl.update(i, upd.newValue);
        return indexMap;
    }
    // remove
    if (matches === false && i != null) {
        indexMap[upd.index] = undefined;
        updateIndex(indexMap, upd.index, (n) => n - 1);
        $nl.splice(i, 1, []);
        return indexMap;
    }
    // add
    const j = closestIndex(upd.index, indexMap, $nl.get().length);
    indexMap[upd.index] = j;
    updateIndex(indexMap, upd.index, (n) => n + 1);
    $nl.splice(j, 0, [upd.newValue]);
    return indexMap;
}

function closestIndex(index: number, indexMap: Index, last: number): number {
    for (let j, i = index; i < indexMap.length; ++i) {
        j = indexMap[i]
        if (j != null) {
            return j
        }
    }
    return last
}