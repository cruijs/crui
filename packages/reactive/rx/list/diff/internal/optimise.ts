import { opReplace, opBatch } from '../../operations/factory';
import { Splice, Update } from '../../types';

export function squashSameIndex<T>(ops: Splice<T>[]): Splice<T>[] {
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

const adjust = (op: Splice<any>) => op.added.length - op.removed.length
export function squashAdjacentInc<T>(ops: Splice<T>[]): Splice<T>[] {
    let last = ops[0]
    const res = [last]
    let di = adjust(last)

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

        di += adjust(cur)
    }

    return res
}

export function batchOrReplace<T>(prev: T[], next: T[], ops: Splice<T>[]): Update<T> {
    const last = ops[0]
    if (ops.length !== 1)
        return last

    const isReplace = 
        last.index === 0
        && last.removed.length === prev.length 
        && last.added.length === next.length

    return isReplace ? opReplace(prev, next) : opBatch(ops)
}