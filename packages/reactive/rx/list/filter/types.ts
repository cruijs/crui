import { RW$L } from '../types';

export type Predicate<T> = (v: T, i: number) => boolean
export type Index = (number|undefined)[]
export type Payload<T> = {
    p: Predicate<T>,
    $list: RW$L<T>,
    indexMap: Index,
}