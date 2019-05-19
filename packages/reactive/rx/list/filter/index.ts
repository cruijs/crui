import { StreamList } from '..';
import { setupFilter } from './internals/setupFilter';
import { Predicate } from './types';

export function $filter<T>($source: StreamList<T>, p: Predicate<T>): StreamList<T> {
    return setupFilter($source, p).$list
}