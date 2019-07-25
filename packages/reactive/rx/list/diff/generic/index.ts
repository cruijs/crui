import { opAdd, opRemove, opReplace } from '../../operations/factory';
import { Splice, Update } from '../../types';
import { optimiseAdd, optimiseRem } from './optimise';

type IMap<T> = Map<T, number>

/**
 * Diff two lists.
 * 
 * Produce the minimum number of operations needed to transform `prev` into `next`
 */
export function diff<T>(prev: T[], next: T[]): Update<T>[] {
    const pim = buildIndex(prev)
    const nim = buildIndex(next)
    const shouldAdd = new Set<T>()
    const shouldRem = new Set<T>()

    let i = 0, j = 0
    const rem: Splice<T>[] = []
    const add: Splice<T>[] = []
    while (i < next.length && j < prev.length) {
        const n = next[i]
        const p = prev[j]

        if (n === p) {
            ++i, ++j
        }
        else if (!pim.has(n) || shouldAdd.has(n)) {
            add.push(opAdd(i, [n]))
            ++i
        } 
        else if (!nim.has(p) || shouldRem.has(p)) {
            rem.push(opRemove(j, [p]))
            ++j
        }
        else {
            const di = nim.get(p)! - i
            const dj = pim.get(n)! - j

            if (di >= dj) {
                rem.push(opRemove(j, [p]))
                shouldAdd.add(p)
                ++j
            }
            else {
                add.push(opAdd(i, [n]))
                shouldRem.add(n)
                ++i
            }
        }
    }

    if ((next.length - i) + add.length === next.length) {
        return [opReplace(prev, next)]
    }

    if (i < next.length) {
        add.push(opAdd(i, next.slice(i)))
    }
    if (j < prev.length) {
        rem.push(opRemove(j, prev.slice(j)))
    }

    return optimiseRem(rem).concat(optimiseAdd(add))
}

function buildIndex<T>(xs: T[]): IMap<T> {
    const map: IMap<T> = new Map()
    for (let i = 0; i < xs.length; ++i)
        map.set(xs[i], i)

    return map
}