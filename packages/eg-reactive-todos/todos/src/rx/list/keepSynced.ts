import { Unsubscribe } from '../../../../../src/type';
import { StreamList, UpdateType } from './index';

export function keepSynced<T>(
    $source: StreamList<T>,
    $dest: StreamList<T>
): Unsubscribe {
    $dest.replace($source.get())
    return $source.subscribe((upd) => {
        switch (upd.type) {
            case UpdateType.Update:
                $dest.update(upd.index, upd.newValue)
                return

            case UpdateType.Replace:
                $dest.replace(upd.newList)
                return
            
            case UpdateType.Splice:
                $dest.splice(upd.index, upd.removed.length, upd.added)
                return
        }
    })
}