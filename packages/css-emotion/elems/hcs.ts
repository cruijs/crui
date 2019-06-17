import { Component, Tag } from '@crui/core/dom';
import { children } from '@crui/core/elems/children';
import { h } from '@crui/core/elems/h';
import { Interpolation } from 'emotion';
import { style } from './css';

export const hcs = <T extends Tag, C, M>(tag: T, s: Interpolation<M>, cs: Component<Tag, C>[] = []): Component<T, C> =>
    h(tag, [style(s), children(cs)])