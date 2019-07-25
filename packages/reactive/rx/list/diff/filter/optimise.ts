import { Splice, Update } from '../../types';
import { squashAdjacentInc, squashSameIndex, tryReplace } from '../internal/optimise';

export function optimise<T>(prev: T[], next: T[], ops: Splice<T>[]): Update<T>[] {
    if (ops.length === 0)
        return ops

    return tryReplace(prev, next, squashAdjacentInc(squashSameIndex(ops)))
}