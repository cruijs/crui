import { Unsubscribe } from '../stream';
import { StreamList, UpdateType } from './index';

export function keepSynced<T>(
    $source: StreamList<T>,
    $dest: StreamList<T>
): Unsubscribe {
    $dest.set($source.get())
    return $source.subscribe((upd) => {
        switch (upd.type) {
            case UpdateType.Update:
                $dest.update(upd.index, upd.newValue)
                return

            case UpdateType.Replace:
                $dest.set(upd.newList)
                return
            
            case UpdateType.Splice:
                $dest.splice(upd.index, upd.removed.length, upd.added)
                return
        }
    })
}