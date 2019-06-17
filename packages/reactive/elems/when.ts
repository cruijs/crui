import { AnyTag, Component } from '@crui/core/dom';
import { empty } from '@crui/core/elems/elem';
import { Cond$B } from '../rx/box/types';
import { $ite } from './ifThenElse';

export function $when<C>(cond: Cond$B, comp: Component<AnyTag, C>): Component<'#swap', C> {
    return $ite(cond, comp, empty)
}