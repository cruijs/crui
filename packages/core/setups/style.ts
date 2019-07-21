import { Meta, Setup, Tag } from '../dom';
import { defResult } from '../dom/rendered';
import { Style } from '../dom/style';

type KS = keyof Style
type PS<K extends KS> = Pick<Style, K>

/**
 * Setup inline style
 */
export const style = <T extends Tag, K extends KS>(style: PS<K>): Setup<{}, Meta<T>> =>
    (meta, dom, node) => {
        dom.applyStyle(node, style)
        return defResult(meta)
    }