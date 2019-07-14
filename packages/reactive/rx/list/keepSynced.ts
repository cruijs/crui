import { Unsubscribe } from '../../../core/types';
import { opApply } from './operations/apply';
import { R$L, W$L } from './types';

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
    return $source.subscribe(opApply($dest))
}

function isSame(a: Object, b: Object): boolean {
    return a === b
}