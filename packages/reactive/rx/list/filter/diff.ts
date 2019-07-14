import { Update, Splice } from '../types'
import { opRemove, opAdd, opReplace } from '../operations/factory'

/**
 * Efficient diff to support filtering of a list
 */
export function diff<T>(prev: T[], next: T[]): Update<T>[] {
    return squash(calculate(prev, next))
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

function squash<T>(ops: Splice<T>[]): Update<T>[] {
    if (ops.length === 0)
        return ops

    return squashAdjacent(squashSameIndex(ops))
}

function squashSameIndex<T>(ops: Splice<T>[]): Splice<T>[] {
    let last = ops[0]
    const res = [last]

    for (let i = 1; i < ops.length; ++i) {
        const cur = ops[i]
        if (last.index === cur.index) {
            last.added = last.added.concat(cur.added)
            last.removed = last.removed.concat(cur.removed)
        }
        else {
            res.push(cur)
            last = cur
        }
    }

    return res
}

function squashAdjacent<T>(ops: Splice<T>[]): Update<T>[] {
    let last = ops[0]
    const res = [last]
    let di = last.added.length - last.removed.length

    for (let i = 1; i < ops.length; ++i) {
        const cur = ops[i]

        if (last.index === (cur.index + di)) {
            last.added = last.added.concat(cur.added)
            last.removed = last.removed.concat(cur.removed)
        }
        else {
            last = cur
            res.push(cur)
            cur.index += di
        }

        di += cur.added.length - cur.removed.length
    }

    return (res.length === 1 && last.index === 0)
        ? [opReplace(last.removed, last.added)]
        : res
}