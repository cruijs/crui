import { Component, Setup } from '../dom';
import { mergeLifecycles, rendered } from '../dom/rendered';
import { configure } from './internals/configure';

type SCombinator = <C, M0, M1>(
    comp: Component<C, M0>, setup: Setup<C, M0, M1>
) => Component<C, M1>

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
export function cm<C, M0, M1, M2>(comp: Component<C, M0>, setups: [Setup<C, M0, M1>, Setup<C, M1, M2>]): Component<C, M2>
export function cm<C, M0, M1, M2, M3>(comp: Component<C, M0>, setups: [Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>]): Component<C, M3>
export function cm<C, M0, M1, M2, M3, M4>(comp: Component<C, M0>, setups: [Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>]): Component<C, M4>
export function cm<C, M0, M1, M2, M3, M4, M5>(comp: Component<C, M0>, setups: [Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>, Setup<C, M4, M5>]): Component<C, M5>
export function cm<C, M0, M1, M2, M3, M4, M5, M6>(comp: Component<C, M0>, setups: [Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>, Setup<C, M4, M5>, Setup<C, M5, M6>]): Component<C, M6>
export function cm<C, M0, M1, M2, M3, M4, M5, M6, M7>(comp: Component<C, M0>, setups: [Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>, Setup<C, M4, M5>, Setup<C, M5, M6>, Setup<C, M6, M7>]): Component<C, M7>
export function cm<C, M0, M1, M2, M3, M4, M5, M6, M7, M8>(comp: Component<C, M0>, setups: [Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>, Setup<C, M4, M5>, Setup<C, M5, M6>, Setup<C, M6, M7>, Setup<C, M7, M8>]): Component<C, M8>
export function cm<C, M0, M1, M2, M3, M4, M5, M6, M7, M8, M9>(comp: Component<C, M0>, setups: [Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>, Setup<C, M4, M5>, Setup<C, M5, M6>, Setup<C, M6, M7>, Setup<C, M7, M8>, Setup<C, M8, M9>]): Component<C, M9>
export function cm<C, M0, M1, M2, M3, M4, M5, M6, M7, M8, M9, M10>(comp: Component<C, M0>, setups: [Setup<C, M0, M1>, Setup<C, M1, M2>, Setup<C, M2, M3>, Setup<C, M3, M4>, Setup<C, M4, M5>, Setup<C, M5, M6>, Setup<C, M6, M7>, Setup<C, M7, M8>, Setup<C, M8, M9>, Setup<C, M9, M10>]): Component<C, M10>
export function cm<C, M0, M1>(comp: Component<C, M0>, setups: Setup<C, M0, M1>[]): Component<C, M1> {
    return (dom, ctxt) => {
        const c = comp(dom, ctxt)
        return configure(dom, ctxt, setups, c.node, c.meta)
    }
}