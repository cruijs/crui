import { Index } from '../types';
import { Splice } from '../../types';

export function calcIndex<T>(upd: Splice<T>, indexMap: Index): number {
    if (indexMap.length === 0) {
        return 0
    }
    if (indexMap.length <= upd.index) {
        return indexMap.length
    }

    let n: number|undefined
    for (let i = upd.index; i < indexMap.length; ++i) {
        n = indexMap[i]
        if (n !== undefined) {
            return n
        }
    }

    return upd.index
}