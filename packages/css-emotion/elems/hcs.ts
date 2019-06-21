import { Component, Tag } from '@crui/core/dom';
import { Meta } from '@crui/core/dom/rendered';
import { h } from '@crui/core/elems/h';
import { children } from '@crui/core/setups/children';
import { Interpolation } from 'emotion';
import { css } from '../setups/css';

export const hcs = <T extends Tag, C, S>(tag: T, s: Interpolation<S>, cs: Component<C, any>[] = []): Component<C, Meta<T>> =>
    h(tag, [css(s), children(cs)])