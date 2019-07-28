import { Setup } from '../dom';
import { defResult } from '../dom/rendered';
import { Meta, Tag } from '../types';

export function attribute<T extends Tag, C>(attr: string, value: string): Setup<C, Meta<T>> {
    return (meta, dom, node) => {
        dom.setAttribute(node, attr, value)
        return defResult(meta)
    }
}