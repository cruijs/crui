import { Component } from '@crui/core/dom';
import { empty } from '@crui/core/elems/empty';
import { Cond$ } from '../rx/types';
import { $ite } from './ifThenElse';

export function $when<C>(cond: Cond$, comp: Component<C>): Component<C> {
    return $ite(cond, comp, empty)
}