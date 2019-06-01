import { Component } from '@crui/core/dom';
import { Tag } from '@crui/core/dom/index';
import { KProps } from '@crui/core/dom/props';
import { Config as Base, withAll } from '@crui/core/elems';
import { Interpolation } from 'emotion';
import { withCSS } from './css';

type Config<K extends KProps, C, MP> = Base<K, C> & {
    css?: Interpolation<MP>
}
/**
 * Create an element with all static aspects configurable, including CSS
 */
export function h<K extends KProps, C, M = undefined>(tag: Tag, cfg: Config<K, C, M>): Component<C> {
    return (dom, ctxt) => {
        const node = dom.create(tag)
        const r = withAll(dom, ctxt, node, cfg)
        if (cfg.css)
            withCSS(dom, node, cfg.css)

        return r
    }
}