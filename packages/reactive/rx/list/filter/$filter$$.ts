import { R$B } from '../../box/types';
import { keepSynced, keepSyncedWith } from '../keepSynced';
import { StreamList } from '../stream';
import { DR$L, R$L } from '../types';
import { $filter$, Predicate$ } from './$filter$';
import { diff } from './diff';

export type $Predicate$<T> = R$B<Predicate$<T>>
export function $filter$$<S, T>(
    $source: R$L<T>,
    $p$: $Predicate$<S>,
    f: (p: Predicate$<S>) => Predicate$<T>
): DR$L<T> {
    let $filtered = $filter$($source, f($p$.get()))

    const $filtered$ = new StreamList<T>([])
    $filtered$.addUnsub(
        () => $filtered.destroy()
    )

    keepSynced($filtered, $filtered$)
    $filtered$.addUnsub(
        $p$.subscribe((p$) => {
            $filtered.destroy()
            $filtered = $filter$(
                $source, f(p$)
            )

            keepSyncedWith($filtered, $filtered$, (target, src) =>
                diff(src, target)
            )
        })
    )

    return $filtered$
}