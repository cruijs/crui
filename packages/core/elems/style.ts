import { Setup } from '../dom/index';
import { defLifecycle } from '../dom/rendered';
import { Style } from '../dom/style';
import { Tag } from '../types';

type KS = keyof Style
type PS<K extends KS> = Pick<Style, K>

export const style = <T extends Tag, K extends KS>(style: PS<K>): Setup<T> =>
    (dom, node) => {
        dom.applyStyle(node, style)
        return defLifecycle()
    }