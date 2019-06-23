import { Component, Setup, Tag } from '../dom';
import { mergeLifecycles, rendered, Meta } from '../dom/rendered';
import { configure } from './internals/configure';

type SCombinator = <T extends Tag, C, D, M extends Meta<T>>(
    comp: Component<C, M>, setup: Setup<D, M>
) => Component<C & D, M>

/**
 * Combine Single
 * Apply a new Setup to a Component
 */
export const cs: SCombinator = (comp, setup) =>
    (dom, ctxt) => {
        const c = comp(dom, ctxt)
        const s = setup(c.meta, dom, c.node, ctxt)
        return rendered(c.node, mergeLifecycles([c.lfc, s.lfc]), s.meta)
    }

/**
 * Combine Multi
 * Apply multiple Setups to a Component
 */
export function cm<T extends Tag, C, C0, C1, M extends Meta<T>>(comp: Component<C, M>, setups: [Setup<C0, M>]): Component<C & C0, M>
export function cm<T extends Tag, C, C0, C1, C2, M extends Meta<T>>(comp: Component<C, M>, setups: [Setup<C0, M>, Setup<C1, M>]): Component<C & C0 & C1, M>
export function cm<T extends Tag, C, C0, C1, C2, C3, M extends Meta<T>>(comp: Component<C, M>, setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>]): Component<C & C0 & C1 & C2, M>
export function cm<T extends Tag, C, C0, C1, C2, C3, C4, M extends Meta<T>>(comp: Component<C, M>, setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>]): Component<C & C0 & C1 & C2 & C3, M>
export function cm<T extends Tag, C, C0, C1, C2, C3, C4, C5, M extends Meta<T>>(comp: Component<C, M>, setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>]): Component<C & C0 & C1 & C2& C3 & C4, M>
export function cm<T extends Tag, C, C0, C1, C2, C3, C4, C5, C6, M extends Meta<T>>(comp: Component<C, M>, setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>, Setup<C5, M>]): Component<C & C0 & C1 & C2 & C3 & C4 & C5, M>
export function cm<T extends Tag, C, C0, C1, C2, C3, C4, C5, C6, C7, M extends Meta<T>>(comp: Component<C, M>, setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>, Setup<C5, M>, Setup<C6, M>]): Component<C & C0 & C1 & C2 & C3 & C4 & C5 & C6, M>
export function cm<T extends Tag, C, C0, C1, C2, C3, C4, C5, C6, C7, C8, M extends Meta<T>>(comp: Component<C, M>, setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>, Setup<C5, M>, Setup<C6, M>, Setup<C7, M>]): Component<C & C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7, M>
export function cm<T extends Tag, C, C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, M extends Meta<T>>(comp: Component<C, M>, setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>, Setup<C5, M>, Setup<C6, M>, Setup<C7, M>, Setup<C8, M>]): Component<C & C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8, M>
export function cm<T extends Tag, C, C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, M extends Meta<T>>(comp: Component<C, M>, setups: [Setup<C0, M>, Setup<C1, M>, Setup<C2, M>, Setup<C3, M>, Setup<C4, M>, Setup<C5, M>, Setup<C6, M>, Setup<C7, M>, Setup<C8, M>, Setup<C9, M>]): Component<C & C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9, M>
export function cm<T extends Tag, C, D, M extends Meta<T>>(comp: Component<C, M>, setups: Setup<D, M>[]): Component<C & D, M>
export function cm<T extends Tag, C, D, M extends Meta<T>>(comp: Component<C, M>, setups: Setup<D, M>[]): Component<C & D, M> {
    return (dom, ctxt) => {
        const c = comp(dom, ctxt)
        return configure(dom, ctxt, setups, c.node, c.meta)
    }
}