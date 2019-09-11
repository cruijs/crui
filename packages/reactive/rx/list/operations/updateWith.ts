import { RW$L, Update } from '../types';

type Diff = <T>(cur: T[], target: T[]) => Update<T>
export function updateWith<T>(diff: Diff, $cur: RW$L<T>, target: T[]): void {
    $cur.apply(diff($cur.get(), target))
}