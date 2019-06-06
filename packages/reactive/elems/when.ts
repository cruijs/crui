import { Component } from '@crui/core/dom';
import { empty } from '@crui/core/elems/empty';
import { StreamBox } from '../rx/box';
import { $ite } from './ifThenElse';

export function $when<C>(cond: StreamBox<boolean>, comp: Component<C>): Component<C> {
    return $ite(cond, comp, empty)
}