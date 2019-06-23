import { Component } from '../dom'
import { children } from '../setups/children'
import { rendered } from '../dom/rendered';

export function fragment<C0>(cs: [Component<C0, any>]): Component<C0, {}>
export function fragment<C0, C1>(cs: [Component<C0, any>, Component<C1, any>]): Component<C0 & C1, {}>
export function fragment<C0, C1, C2>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>]): Component<C0 & C1 & C2, {}>
export function fragment<C0, C1, C2, C3>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>]): Component<C0 & C1 & C2 & C3, {}>
export function fragment<C0, C1, C2, C3, C4>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>]): Component<C0 & C1 & C2 & C3 & C4, {}>
export function fragment<C0, C1, C2, C3, C4, C5>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>]): Component<C0 & C1 & C2 & C3 & C4 &C5, {}>
export function fragment<C0, C1, C2, C3, C4, C5, C6>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6, {}>
export function fragment<C0, C1, C2, C3, C4, C5, C6, C7>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7, {}>
export function fragment<C0, C1, C2, C3, C4, C5, C6, C7, C8>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>, Component<C8, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8, {}>
export function fragment<C0, C1, C2, C3, C4, C5, C6, C7, C8, C9>(cs: [Component<C0, any>, Component<C1, any>, Component<C2, any>, Component<C3, any>, Component<C4, any>, Component<C5, any>, Component<C6, any>, Component<C7, any>, Component<C8, any>, Component<C9, any>]): Component<C0 & C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9, {}>
export function fragment<C>(cs: Component<C>[]): Component<C, {}>
export function fragment<C>(cs: Component<C>[]): Component<C, {}> {
    return (dom, ctxt) => {
        const node = dom.createFragment()
        const meta = {}
        const r = children(cs)(meta, dom, node, ctxt)
        return rendered(node, r.lfc, meta)
    }
}