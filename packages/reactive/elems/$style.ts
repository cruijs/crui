import { Component, DOM, Tag } from '@crui/core/dom';
import { defRendered, modRendered, Rendered } from '@crui/core/dom/rendered';
import { Style } from '@crui/core/dom/style';
import { combine } from '@crui/core/utils/combine';
import { keys } from '@crui/core/utils/object';
import { Reactive } from '../utils/reactive';

export type $Style = Reactive<Style>
export type K$S = keyof $Style
export type P$S<K extends K$S> = Pick<$Style, K>
export function h$style(tag: Tag, style: $Style): Component<any> {
    return (dom) => {
        const node = dom.create(tag)
        return with$Style(dom, node, style)
    }
}

export function with$Style<N, K extends K$S>(dom: DOM<N>, node: N, style?: P$S<K>): Rendered<N> {
    if (style == null) {
        return defRendered(node)
    }

    const unsubs = keys(style).map((k) => {
        style[k].apply((val) => {
            dom.applyStyle(node, { [k]: val } as {[K in typeof k]: Style[K]})
        })
        return style[k].destroy
    })
    return modRendered(node, (m) => {
        m.unsub = combine(unsubs)
    })
}