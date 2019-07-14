import { Unsubscribe } from '../../../core/types';
import { opApply, opsApply } from './operations/apply';
import { opReplace } from './operations/factory';
import { R$L, RW$L, Update } from './types';

/**
 * Keep two streams in sync. 
 * Any values contained in `$dest` will be replaced by `$source` content.
 */
export function keepSynced<T>(
    $source: R$L<T>,
    $dest: RW$L<T>
): Unsubscribe {
    return keepSyncedWith($source, $dest, (src, dst) => [
        opReplace(dst, src)
    ])
}

export function keepSyncedWith<T>(
    $source: R$L<T>,
    $dest: RW$L<T>,
    replace: (src: T[], dst: T[]) => Update<T>[]
): Unsubscribe {
    if (isSame($source, $dest)) {
        throw Error('Sync on same stream is not supported')
    }
    opsApply(
        $dest,
        replace($source.get(), $dest.get())
    )
    return $source.subscribe(opApply($dest))
}

function isSame(a: Object, b: Object): boolean {
    return a === b
}