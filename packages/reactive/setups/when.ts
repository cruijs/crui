import { Component } from '@crui/core/dom';
import { empty } from '@crui/core/elems/empty';
import { Cond$B } from '../rx/box/types';
import { c$ite } from './ifThenElse';

/**
 * Display given child only when the condition is met
 */
export function c$when<C>(cond: Cond$B, comp: Component<C>) {
    return c$ite(cond, comp, empty)
}