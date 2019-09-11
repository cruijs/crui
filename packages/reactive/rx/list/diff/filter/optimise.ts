import { opBatch } from '../../operations/factory';
import { Splice, Update } from '../../types';
import { batchOrReplace, squashAdjacentInc, squashSameIndex } from '../internal/optimise';

export function optimise<T>(prev: T[], next: T[], ops: Splice<T>[]): Update<T> {
    if (ops.length === 0)
        return opBatch(ops)

    return batchOrReplace(prev, next, squashAdjacentInc(squashSameIndex(ops)))
}