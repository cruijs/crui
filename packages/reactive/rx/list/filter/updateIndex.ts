import { Index } from './types';

export function updateIndex(indexMap: Index, index: number, uf: (n: number) => number) {
    let n: number | undefined;
    for (let i = index + 1; i < indexMap.length; ++i) {
        n = indexMap[i];
        if (n != null) {
            indexMap[i] = uf(n);
        }
    }
}
