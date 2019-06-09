import { R$L } from '../types';
import { setupFilter } from './internals/setupFilter';
import { Predicate } from './types';

export function $filter<T>($source: R$L<T>, p: Predicate<T>) {
    return setupFilter($source, p).$list
}