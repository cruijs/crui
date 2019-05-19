import { Unsubscribe } from '@crui/core/type';
import { StreamList, UpdateType } from './index';
import { combine2 } from '../../../core/utils/combine'

export function cleanup<T>($list: StreamList<T>, f: (v: T) => void): Unsubscribe {
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