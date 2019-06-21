import { Setup, Tag } from '@crui/core/dom';
import { modLifecycle, result } from '@crui/core/dom/rendered';
import { Style } from '@crui/core/dom/style';
import { combine } from '@crui/core/utils/combine';
import { keys } from '@crui/core/utils/object';
import { apply } from '../rx/box/apply';
import { Reactive } from '../utils/reactive';

export type $Style = Reactive<Style>
export type K$S = keyof $Style
export type P$S<K extends K$S> = Pick<$Style, K>
export function $style<K extends K$S, M>(style: P$S<K>): Setup<{}, M> {
    return (meta, dom, node) => result(
        meta,
        modLifecycle((m) => {
            const unsubs = keys(style).map((k) => {
                apply(style[k], (val) => {
                    dom.applyStyle(node, { [k]: val } as { [K in typeof k]: Style[K] })
                })
                return style[k].destroy
            })

            m.unsub = combine(unsubs)
        })
    )
}