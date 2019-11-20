import { AnyNodeAction, cleanup } from '@crui/core'
import { setupNode } from '@crui/reactive'
import { NoMorphingR } from '@crui/reactive/restrictions/morphing'
import { destroyDim, makeDim, RWDim } from '../dimensions'

type Make<C extends AnyNodeAction> = (dim: RWDim) => NoMorphingR<C>
export function withDim<C extends AnyNodeAction>(make: Make<C>) {
    const dim = makeDim()

    return setupNode(make(dim), [cleanup(() => {
        destroyDim(dim)
    })])
}