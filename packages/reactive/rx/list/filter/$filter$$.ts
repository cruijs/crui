import { StreamList } from '..';
import { Stream } from '../../stream';
import { keepSynced } from '../keepSynced';
import { $filter$, Predicate$ } from './$filter$';

export type $Predicate$<T> = Stream<Predicate$<T>>
export function $filter$$<S, T>(
    $source: StreamList<T>,
    $p$: $Predicate$<S>,
    f: (p: Predicate$<S>) => Predicate$<T>
): StreamList<T> {
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
                keepSynced($filtered, $filtered$)
            })
        )

        return $filtered$
}