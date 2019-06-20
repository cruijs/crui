import { Component, Setup } from '../dom';
import { Meta } from '../dom/rendered';
import { Tag } from '../types';
import { configure } from './internals/configure';

/**
 * An element for which anything can be configured.
 */
export function h<T extends Tag, C, M0>(tag: T, setups: [Setup<C, Meta<T>, M0>]): Component<C, M0>
export function h<T extends Tag, C, M0, M1>(tag: T, setups: [Setup<C, Meta<T>, M0>, Setup<C, M0, M1>]): Component<C, M1>
export function h<T extends Tag, C, M0, M1, M2>(tag: T, setups: [Setup<C, Meta<T>, M0>, Setup<C, M0, M1>, Setup<C, M1, M2>]): Component<C, M2>
export function h<T extends Tag, C, M0, M1, M2, M3>(tag: T, setups: [Setup<C, Meta<T>, M0>, Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>]): Component<C, M3>
export function h<T extends Tag, C, M0, M1, M2, M3, M4>(tag: T, setups: [Setup<C, Meta<T>, M0>, Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>]): Component<C, M4>
export function h<T extends Tag, C, M0, M1, M2, M3, M4, M5>(tag: T, setups: [Setup<C, Meta<T>, M0>, Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>, Setup<C, M4, M5>]): Component<C, M5>
export function h<T extends Tag, C, M0, M1, M2, M3, M4, M5, M6>(tag: T, setups: [Setup<C, Meta<T>, M0>, Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>, Setup<C, M4, M5>, Setup<C, M5, M6>]): Component<C, M6>
export function h<T extends Tag, C, M0, M1, M2, M3, M4, M5, M6, M7>(tag: T, setups: [Setup<C, Meta<T>, M0>, Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>, Setup<C, M4, M5>, Setup<C, M5,M6>, Setup<C, M6, M7>]): Component<C, M7>
export function h<T extends Tag, C, M0, M1, M2, M3, M4, M5, M6, M7, M8>(tag: T, setups: [Setup<C, Meta<T>, M0>, Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>, Setup<C, M4, M5>, Setup<C,M5, M6>, Setup<C, M6, M7>, Setup<C, M7, M8>]): Component<C, M8>
export function h<T extends Tag, C, M0, M1, M2, M3, M4, M5, M6, M7, M8, M9>(tag: T, setups: [Setup<C, Meta<T>, M0>, Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>, Setup<C, M4, M5>, Setup<C, M5, M6>, Setup<C, M6, M7>, Setup<C, M7, M8>, Setup<C, M8, M9>]): Component<C, M9>
export function h<T extends Tag, C>(tag: T, setups: Setup<C, Meta<T>>[]): Component<C, Meta<T>> {
    return (dom, ctxt) =>
        configure(dom, ctxt, setups, dom.create(tag), { tag })
}