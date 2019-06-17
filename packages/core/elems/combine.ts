import { Component, Setup, Tag } from '../dom';
import { mergeLifecycles } from '../dom/rendered';
import { modify } from '../utils/modify';

export type SCombinator = <T extends Tag, C, D>(
    comp: Component<T, C>, setup: Setup<T, D>
) => Component<T, C & D>

/**
 * Combine Single
 * Apply a new Setup to a Component
 */
export const cs: SCombinator = (comp, setup) =>
    (dom, ctxt) => (
        modify(comp(dom, ctxt), (r) => {
            r.lfc = mergeLifecycles([
                r.lfc,
                setup(dom, r.node, ctxt)
            ])
        })
    )

export type MCombinator = <T extends Tag, C, D>(
    comp: Component<T, C>, setup: Setup<T, D>[]
) => Component<T, C & D>
/**
 * Combine Multi
 * Apply multiple Setups to a Component
 */
export const cm: MCombinator = (comp, setups) =>
    (dom, ctxt) => (
        modify(comp(dom, ctxt), (r) => {
            const ls = setups.map((setup) => 
                setup(dom, r.node, ctxt)
            )
            ls.unshift(r.lfc)

            r.lfc = mergeLifecycles(ls)
        })
    )