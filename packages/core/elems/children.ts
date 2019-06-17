import { Component } from '../dom/index';
import { Meta } from '../dom/rendered';
import { children } from '../setups/children';
import { Tag } from '../types';
import { h } from './h';

/**
 * An element with children
 */
export function hc<T extends Tag, C0>(tag: T, cs: [Component<C0, any>]): Component<C0, Meta<T>>
export function hc<T extends Tag, C0, C1>(tag: T, cs: [Component<C0, any>, Component<C1, any>]): Component<C0 & C1, Meta<T>>
export function hc<T extends Tag, C0, C1, C2>(tag: T, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>]): Component<C0 & C1 & C2, Meta<T>>
export function hc<T extends Tag, C0, C1, C2, C3>(tag: T, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>]): Component<C0 & C1 & C2 & C3, Meta<T>>
export function hc<T extends Tag, C0, C1, C2, C3, C4>(tag: T, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>]): Component<C0 & C1 & C2 & C3 & C4, Meta<T>>
export function hc<T extends Tag, C0, C1, C2, C3, C4, C5>(tag: T, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>]): Component<C0 & C1& C2 & C3 & C4 & C5, Meta<T>>
export function hc<T extends Tag, C0, C1, C2, C3, C4, C5, C6>(tag: T, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6, Meta<T>>
export function hc<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7>(tag: T, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7, Meta<T>>
export function hc<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7, C8>(tag: T, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>, Component<C8, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8, Meta<T>>
export function hc<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7, C8, C9>(tag: T, cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>, Component<C8, any>, Component<C9, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9, Meta<T>>
export function hc<T extends Tag, C>(tag: T, cs: Component<C, {}>[]): Component<C, Meta<T>>
export function hc<T extends Tag, C>(tag: T, cs: Component<C, {}>[]): Component<C, Meta<T>> {
    return h(tag, children(cs))
}