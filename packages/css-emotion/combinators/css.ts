import { Component } from '@crui/core/dom'
import { Interpolation } from 'emotion';
import { withCSS } from '../elems/css'

/**
 * Add CSS to a Component
 */
export function wss<C, M>(comp: Component<C>, css: Interpolation<M>): Component<C> {
    return (dom, ctxt) => {
        const r = comp(dom, ctxt)
        withCSS(dom, r.node, css)
        return r
    }
}