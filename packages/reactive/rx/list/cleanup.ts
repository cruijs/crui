import { Unsubscribe } from '@crui/core/type';
import { combine2 } from '@crui/core/utils/combine';
import { R$L, UpdateType } from './types';

/**
 * Perform some cleanup action everytime an element is removed from the StreamList
 */
export function cleanup<T>($list: R$L<T>, f: (v: T) => void): Unsubscribe {
    return combine2(
        () => {
            $list.forEach(f)
        },
        $list.subscribe((upd) => {
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
            }
        })
    )
}