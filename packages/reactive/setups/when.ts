import { Component } from '@crui/core/dom';
import { empty } from '@crui/core/elems/empty';
import { Cond$B } from '../rx/box/types';
import { $ite } from './ifThenElse';

export function $when<C>(cond: Cond$B, comp: Component<C>) {
    return $ite(cond, comp, empty)
}