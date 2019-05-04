import { StreamList } from '..';

export type Predicate<T> = (v: T) => boolean
export type Index = (number|undefined)[]
export type Payload<T> = {
    p: Predicate<T>,
    $nl: StreamList<T>,
    indexMap: Index,
}