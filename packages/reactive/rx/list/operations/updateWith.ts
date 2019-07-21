import { RW$L, Update } from '../types';
import { opsApply } from './apply';

type Diff = <T>(cur: T[], target: T[]) => Update<T>[]
export function updateWith<T>(diff: Diff, $cur: RW$L<T>, target: T[]): void {
    opsApply($cur, diff($cur.get(), target))
}