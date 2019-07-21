import { Meta, Setup, Tag } from '../dom';
import { Props } from '../dom/props';
import { defResult } from '../dom/rendered';

type KProps = keyof Props
type PProps<K extends KProps> = Pick<Props, K>

/**
 * Setup a set of properties
 */
export function props<T extends Tag, K extends KProps>(props: PProps<K>): Setup<{}, Meta<T>> {
    return (meta, dom, node) => {
        dom.setProps(node, props)
        return defResult(meta)
    }
}