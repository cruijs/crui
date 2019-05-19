import { Index, Predicate } from '../types';

export function filteredList<T>(ls: T[], start: number, p: Predicate<T>) {
    const filtered = [];
    const indexMap: Index = Array(ls.length);
    for (let i = 0; i < ls.length; ++i) {
        if (p(ls[i], start + i)) {
            filtered.push(ls[i]);
            indexMap[i] = filtered.length - 1;
        }
    }
    return { filtered, indexMap };
}
