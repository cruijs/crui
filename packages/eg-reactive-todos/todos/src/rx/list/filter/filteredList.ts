import { Index, Predicate } from './types';

export function filteredList<T>(ls: T[], p: Predicate<T>) {
    const filtered = [];
    const indexMap: Index = Array(ls.length).fill(null);
    for (let i = 0; i < ls.length; ++i) {
        if (p(ls[i])) {
            filtered.push(ls[i]);
            indexMap[i] = filtered.length - 1;
        }
    }
    return { filtered, indexMap };
}
