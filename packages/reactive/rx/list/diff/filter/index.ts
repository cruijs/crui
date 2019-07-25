import { optimise } from './optimise';
import { opAdd, opRemove } from '../../operations/factory';
import { Splice, Update } from '../../types';

/**
 * Diff two lists after filtering.
 * 
 * This algorithm is much more efficient than general one thanks to the assumption
 * that elements will only be added or removed, but not changing position.
 */
export function diff<T>(prev: T[], next: T[]): Update<T>[] {
    return optimise(prev, next, calculate(prev, next))
}

function calculate<T>(prev: T[], next: T[]): Splice<T>[] {
    const ops: Splice<T>[] = []

    let p = 0, n = 0
    const nextSet = new Set(next)
    while (p < prev.length && n < next.length) {
        if (prev[p] === next[n]) {
            ++p
            ++n
        }
        else if(nextSet.has(prev[p])) {
            ops.push(
                opAdd(p, [next[n]])
            )
            ++n
        }
        else {
            ops.push(
                opRemove(p, [prev[p]])
            )
            ++p
        }
    }
    if (p < prev.length) {
        ops.push(
            opRemove(p, prev.slice(p))
        )
    }
    if (n < next.length) {
        ops.push(
            opAdd(p, next.slice(n))
        )
    }
    return ops
}