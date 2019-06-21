import { Component, Setup } from '../dom';
import { Meta } from '../dom/rendered';
import { Tag } from '../types';
import { configure } from './internals/configure';

/**
 * An element for which anything can be configured.
 */
export function h<T extends Tag, C0, M0>(tag: T, setups: [Setup<C0, Meta<T>, M0>]): Component<C0, M0>
export function h<T extends Tag, C0, C1, M0, M1>(tag: T, setups: [Setup<C0, Meta<T>, M0>, Setup<C1, M0, M1>]): Component<C0 & C1, M1>
export function h<T extends Tag, C0, C1, C2, M0, M1, M2>(tag: T, setups: [Setup<C0, Meta<T>, M0>, Setup<C1, M0, M1>, Setup<C2, M1, M2>]): Component<C0 & C1 & C2, M2>
export function h<T extends Tag, C0, C1, C2, C3, M0, M1, M2, M3>(tag: T, setups: [Setup<C0, Meta<T>, M0>, Setup<C1, M0, M1>, Setup<C2, M1, M2>, Setup<C3, M2, M3>]): Component<C0 & C1 & C2 & C3, M3>
export function h<T extends Tag, C0, C1, C2, C3, C4, M0, M1, M2, M3, M4>(tag: T, setups: [Setup<C0, Meta<T>, M0>, Setup<C1, M0, M1>, Setup<C2, M1, M2>, Setup<C3, M2, M3>, Setup<C4, M3, M4>]): Component<C0 & C1 & C2 & C3 & C4, M4>
export function h<T extends Tag, C0, C1, C2, C3, C4, C5, M0, M1, M2, M3, M4, M5>(tag: T, setups: [Setup<C0, Meta<T>, M0>, Setup<C1, M0, M1>, Setup<C2, M1, M2>, Setup<C3, M2, M3>, Setup<C4, M3, M4>, Setup<C5, M4, M5>]): Component<C0 & C1 & C2 & C3 & C4 & C5, M5>
export function h<T extends Tag, C0, C1, C2, C3, C4, C5, C6, M0, M1, M2, M3, M4, M5, M6>(tag: T, setups: [Setup<C0, Meta<T>, M0>, Setup<C1, M0, M1>, Setup<C2, M1, M2>, Setup<C3, M2, M3>, Setup<C4, M3, M4>, Setup<C5, M4, M5>, Setup<C6, M5, M6>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6, M6>
export function h<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7, M0, M1, M2, M3, M4, M5, M6, M7>(tag: T, setups: [Setup<C0, Meta<T>, M0>, Setup<C1, M0, M1>, Setup<C2, M1, M2>, Setup<C3, M2, M3>, Setup<C4, M3, M4>, Setup<C5, M4, M5>, Setup<C6, M5, M6>, Setup<C7, M6, M7>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7, M7>
export function h<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7, C8, M0, M1, M2, M3, M4, M5, M6, M7, M8>(tag: T, setups: [Setup<C0, Meta<T>, M0>, Setup<C1, M0, M1>, Setup<C2, M1, M2>, Setup<C3, M2, M3>, Setup<C4, M3, M4>, Setup<C5, M4, M5>, Setup<C6, M5, M6>, Setup<C7, M6, M7>, Setup<C8, M7, M8>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8, M8>
export function h<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, M0, M1, M2, M3, M4, M5, M6, M7, M8, M9>(tag: T, setups: [Setup<C0, Meta<T>, M0>, Setup<C1, M0, M1>, Setup<C2, M1, M2>, Setup<C3, M2, M3>,Setup<C4, M3, M4>, Setup<C5, M4, M5>, Setup<C6, M5, M6>, Setup<C7, M6, M7>, Setup<C8, M7, M8>, Setup<C9, M8, M9>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9, M9>
export function h<T extends Tag, C>(tag: T, setups: Setup<C, Meta<T>>[]): Component<C, Meta<T>>
export function h<T extends Tag, C>(tag: T, setups: Setup<C, Meta<T>>[]): Component<C, Meta<T>> {
    return (dom, ctxt) =>
        configure(dom, ctxt, setups, dom.create(tag), { tag })
}