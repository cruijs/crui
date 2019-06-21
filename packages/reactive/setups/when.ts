import { Component } from '@crui/core/dom';
import { Setup } from '@crui/core/dom/index';
import { empty } from '@crui/core/elems/empty';
import { Cond$B } from '../rx/box/types';
import { $ite } from './ifThenElse';

export function $when<C, M>(cond: Cond$B, comp: Component<C>): Setup<C, M> {
    return $ite(cond, comp, empty)
}