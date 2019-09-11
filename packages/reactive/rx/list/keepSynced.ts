import { Unsubscribe } from '@crui/core/types';
import { opReplace } from './operations/factory';
import { R$L, RW$L, Update } from './types';

/**
 * Keep two streams in sync. 
 * Any values contained in `$dest` will be replaced by `$source` content.
 */
export function keepSynced<T>(
    $master: R$L<T>,
    $slave: RW$L<T>
): Unsubscribe {
    return keepSyncedWith($master, $slave, (slave, master) => (
        opReplace(slave, master)
    ))
}

export function keepSyncedWith<T>(
    $master: R$L<T>,
    $slave: RW$L<T>,
    diff: (slave: T[], master: T[]) => Update<T>
): Unsubscribe {
    if (isSame($master, $slave)) {
        throw Error('Sync on same stream is not supported')
    }
    $slave.apply(
        diff($slave.get(), $master.get())
    )
    return $master.subscribe((upd) => $slave.apply(upd))
}

function isSame(a: Object, b: Object): boolean {
    return a === b
}