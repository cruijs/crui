import { Component, Meta, Tag } from '@crui/core/dom';
import { h } from '@crui/core/elems/h';
import { children } from '@crui/core/setups/children';
import { sc2 } from '@crui/core/setups/combine/two';
import { Interpolation } from 'emotion';
import { css } from '../setups/css';

export function hcs<T extends Tag, C0, S>(tag: T, s: Interpolation<S>, cs: [Component<C0, any>]): Component<C0, Meta<T>>
export function hcs<T extends Tag, C0, C1, S>(tag: T, s: Interpolation<S>, cs: [Component<C0, any>, Component<C1, any>]): Component<C0 & C1, Meta<T>>
export function hcs<T extends Tag, C0, C1, C2, S>(tag: T, s: Interpolation<S>, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>]): Component<C0 & C1 & C2, Meta<T>>
export function hcs<T extends Tag, C0, C1, C2, C3, S>(tag: T, s: Interpolation<S>, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>]): Component<C0 & C1 & C2 & C3, Meta<T>>
export function hcs<T extends Tag, C0, C1, C2, C3, C4, S>(tag: T, s: Interpolation<S>, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>]): Component<C0 & C1 & C2 & C3 & C4, Meta<T>>
export function hcs<T extends Tag, C0, C1, C2, C3, C4, C5, S>(tag: T, s: Interpolation<S>, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5, Meta<T>>
export function hcs<T extends Tag, C0, C1, C2, C3, C4, C5, C6, S>(tag: T, s: Interpolation<S>, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6, Meta<T>>
export function hcs<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7, S>(tag: T, s: Interpolation<S>, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7, Meta<T>>
export function hcs<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7, C8, S>(tag: T, s: Interpolation<S>, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>, Component<C8, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8, Meta<T>>
export function hcs<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, S>(tag: T, s: Interpolation<S>, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>, Component<C8, any>, Component<C9, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9, Meta<T>>
export function hcs<T extends Tag, C, S>(tag: T, s: Interpolation<S>, cs: Component<C, any>[]): Component<C, Meta<T>>
export function hcs<T extends Tag, C, S>(tag: T, s: Interpolation<S>, cs: Component<C, any>[]): Component<C, Meta<T>> {
    return h(tag, sc2(css(s), children(cs)))
}