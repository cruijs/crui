import { Component, Setup } from '../dom';
import { Meta } from '../dom/rendered';
import { Tag } from '../types';
import { configure } from './internals/configure';

/**
 * An element for which anything can be configured.
 */
export function h<T extends Tag, C0>(tag: T, setups: [Setup<C0, Meta<T>>]): Component<C0, Meta<T>>
export function h<T extends Tag, C0, C1>(tag: T, setups: [Setup<C0, Meta<T>>, Setup<C1, Meta<T>>]): Component<C0 & C1, Meta<T>>
export function h<T extends Tag, C0, C1, C2>(tag: T, setups: [Setup<C0, Meta<T>>, Setup<C1, Meta<T>>, Setup<C2, Meta<T>>]): Component<C0 & C1 & C2, Meta<T>>
export function h<T extends Tag, C0, C1, C2, C3>(tag: T, setups: [Setup<C0, Meta<T>>, Setup<C1, Meta<T>>, Setup<C2, Meta<T>>, Setup<C3, Meta<T>>]): Component<C0 & C1 & C2 & C3, Meta<T>>
export function h<T extends Tag, C0, C1, C2, C3, C4>(tag: T, setups: [Setup<C0, Meta<T>>, Setup<C1, Meta<T>>, Setup<C2, Meta<T>>, Setup<C3, Meta<T>>, Setup<C4, Meta<T>>]): Component<C0 & C1 & C2 & C3 & C4, Meta<T>>
export function h<T extends Tag, C0, C1, C2, C3, C4, C5>(tag: T, setups: [Setup<C0, Meta<T>>, Setup<C1, Meta<T>>, Setup<C2, Meta<T>>, Setup<C3, Meta<T>>, Setup<C4, Meta<T>>, Setup<C5, Meta<T>>]): Component<C0 &C1 & C2 & C3 & C4 & C5, Meta<T>>
export function h<T extends Tag, C0, C1, C2, C3, C4, C5, C6>(tag: T, setups: [Setup<C0, Meta<T>>, Setup<C1, Meta<T>>, Setup<C2, Meta<T>>, Setup<C3, Meta<T>>, Setup<C4, Meta<T>>, Setup<C5, Meta<T>>, Setup<C6, Meta<T>>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6, Meta<T>>
export function h<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7>(tag: T, setups: [Setup<C0, Meta<T>>, Setup<C1, Meta<T>>, Setup<C2, Meta<T>>, Setup<C3, Meta<T>>, Setup<C4, Meta<T>>, Setup<C5, Meta<T>>, Setup<C6, Meta<T>>, Setup<C7, Meta<T>>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7, Meta<T>>
export function h<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7, C8>(tag: T, setups: [Setup<C0, Meta<T>>, Setup<C1, Meta<T>>, Setup<C2, Meta<T>>, Setup<C3, Meta<T>>, Setup<C4, Meta<T>>, Setup<C5, Meta<T>>, Setup<C6, Meta<T>>, Setup<C7, Meta<T>>, Setup<C8, Meta<T>>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8, Meta<T>>
export function h<T extends Tag, C0, C1, C2, C3, C4, C5, C6, C7, C8, C9>(tag: T, setups: [Setup<C0, Meta<T>>, Setup<C1, Meta<T>>, Setup<C2, Meta<T>>, Setup<C3, Meta<T>>, Setup<C4, Meta<T>>, Setup<C5, Meta<T>>, Setup<C6, Meta<T>>, Setup<C7, Meta<T>>, Setup<C8, Meta<T>>, Setup<C9, Meta<T>>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9, Meta<T>>
export function h<T extends Tag, C>(tag: T, setups: Setup<C, Meta<T>>[]): Component<C, Meta<T>>
export function h<T extends Tag, C>(tag: T, setups: Setup<C, Meta<T>>[]): Component<C, Meta<T>> {
    return (dom, ctxt) =>
        configure(dom, ctxt, setups, dom.create(tag), { tag })
}