import { Component } from '@crui/core/dom';
import { Interpolation } from 'emotion';
import { h } from './index';

export const hcs = <C, M>(tag: string, css: Interpolation<M>, children?: Component<C>[]): Component<C> =>
    h(tag, { css, children })