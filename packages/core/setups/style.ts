import { Setup } from '../dom/index';
import { defResult } from '../dom/rendered';
import { Style } from '../dom/style';

type KS = keyof Style
type PS<K extends KS> = Pick<Style, K>

export const style = <M, K extends KS>(style: PS<K>): Setup<{}, M> =>
    (meta, dom, node) => {
        dom.applyStyle(node, style)
        return defResult(meta)
    }