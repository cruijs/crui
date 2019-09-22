import { opNoop } from '../../operations/factory';
import { Splice, Update } from '../../types';
import { batchOrReplace, squashAdjacentInc, squashSameIndex } from '../internal/optimise';

export function optimise<T>(prev: readonly T[], next: readonly T[], ops: readonly Splice<T>[]): Update<T> {
    return (ops.length === 0)
        ? opNoop
        : batchOrReplace(prev, next, squashAdjacentInc(squashSameIndex(ops)))
}