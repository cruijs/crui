import { Update, UpdateType, W$L } from '../types';

export function opsApply<T>(list: W$L<T>, ops: Update<T>[]): void {
    ops.forEach(opApply(list))
}

export const opApply = <T>(list: W$L<T>) => (op: Update<T>): void => {
    switch (op.type) {
        case UpdateType.Replace:
            list.set(op.newList)
            return

        case UpdateType.Update:
            list.update(op.index, op.newValue)
            return
        
        case UpdateType.Splice:
            list.splice(op.index, op.removed.length, op.added)
            return
    }
}