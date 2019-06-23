import { Setup } from '../dom/index';
import { Props } from '../dom/props';
import { defResult } from '../dom/rendered';

type KProps = keyof Props
type PProps<K extends KProps> = Pick<Props, K>

export function props<K extends KProps>(props: PProps<K>): Setup {
    return (meta, dom, node) => {
        dom.setProps(node, props)
        return defResult(meta)
    }
}