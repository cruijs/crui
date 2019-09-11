import { combine2 } from '@crui/core/utils/combine';
import { Unsubscribe } from '../../../core/types';
import { R$L, Update, UpdateType } from './types';

/**
 * Perform some cleanup action everytime an element is removed from the StreamList
 */
export function cleanup<T>($list: R$L<T>, f: (v: T) => void): Unsubscribe {
    return combine2(
        () => {
            $list.forEach(f)
        },
        $list.subscribe((upd) => {
            runCleanup(f, upd)
        })
    )
}

function runCleanup<T>(f: (v: T) => void, upd: Update<T>) {
    switch (upd.type) {
        case UpdateType.Update:
            if (upd.oldValue !== upd.newValue)
                f(upd.oldValue)
            return

        case UpdateType.Replace:
            upd.oldList.forEach(f)
            return

        case UpdateType.Splice:
            upd.removed.forEach(f)
            return

        case UpdateType.Batch:
            upd.ops.forEach((u) => runCleanup(f, u))
            return
    }
}