import { Component, Meta, Tag } from '@crui/core/dom';
import { modifyLfc } from '@crui/core/dom/rendered';
import { combine2 } from '@crui/core/utils/combine';
import { destroyDim, makeDim, RWDim } from '../dimensions';

type UseDim<C, T extends Tag> = (dim: RWDim) => Component<C, Meta<T>>
export function withDim<C, T extends Tag>(useDim: UseDim<C, T>): Component<C, Meta<T>> {
    const dim = makeDim()
    const comp = useDim(dim)

    return (dom, ctxt) => modifyLfc(comp(dom, ctxt), (m) => {
        m.unsub = combine2(m.unsub, () => {
            destroyDim(dim)
        })
    })
}