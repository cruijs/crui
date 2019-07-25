import { Splice } from '../../types';
import { squashAdjacentInc, squashSameIndex } from '../internal/optimise';

export function optimiseRem<T>(ops: Splice<T>[]) {
    return ops.length === 0 ? ops : squashAdjacentInc(squashSameIndex(ops))
}

export function optimiseAdd<T>(ops: Splice<T>[]) {
    return (ops.length === 0) ? ops : squashAdjacent(ops)
}

function squashAdjacent<T>(ops: Splice<T>[]): Splice<T>[] {
    let last = ops[0]
    const res = [last]
    let di = 1

    for (let i = 1; i < ops.length; ++i) {
        const cur = ops[i]

        if (last.index === (cur.index - di)) {
            ++di
            last.added = last.added.concat(cur.added)
            last.removed = last.removed.concat(cur.removed)
        }
        else {
            di = 1
            last = cur
            res.push(cur)
        }
    }

    return res
}