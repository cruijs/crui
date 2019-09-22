import { RW$L, Update } from '../types';

type Diff = <T>(cur: readonly T[], target: readonly T[]) => Update<T>
export function updateWith<T>(diff: Diff, $cur: RW$L<T>, target: readonly T[]): void {
    $cur.apply(diff($cur.get(), target))
}