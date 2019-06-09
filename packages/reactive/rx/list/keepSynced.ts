import { Unsubscribe } from '@crui/core/type';
import { R$L, UpdateType, W$L } from './types';

/**
 * Keep two streams in sync. 
 * Any values contained in `$dest` will be replaced by `$source` content.
 */
export function keepSynced<T>(
    $source: R$L<T>,
    $dest: W$L<T>
): Unsubscribe {
    if (isSame($source, $dest)) {
        throw Error('Sync on same stream is not supported')
    }
    $dest.set($source.get().slice())
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

function isSame(a: Object, b: Object): boolean {
    return a === b
}