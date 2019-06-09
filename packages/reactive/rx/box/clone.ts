import { StreamBox } from './stream';
import { transform } from './transform';
import { DR$B, DRW$B, R$B, RW$B } from './types';

export const id = <T>(a: T) => a
/**
 * Simply clone a read-write stream.
 * Useful when you want to prevent other parts of the code to destroy this stream.
 */
export function clone<T>(source: RW$B<T>): DRW$B<T> {
    return transform(source, id, id)
}

/**
 * Read-only clone of a stream.
 * Useful when you want to prevent other parts of the code to destroy this stream.
 */
export function cloneRO<T>(source: R$B<T>): DR$B<T> {
    const $box = new StreamBox(source.get())
    $box.addUnsub(source.subscribe((val) => {
        $box.set(val)
    }))
    return $box

}