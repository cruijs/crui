import { Setup } from '../dom/index';
import { defResult } from '../dom/rendered';
import { Style } from '../dom/style';

type KS = keyof Style
type PS<K extends KS> = Pick<Style, K>

/**
 * Setup inline style
 */
export const style = <K extends KS>(style: PS<K>): Setup =>
    (meta, dom, node) => {
        dom.applyStyle(node, style)
        return defResult(meta)
    }