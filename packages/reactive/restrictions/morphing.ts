import { NoRestr, AnyNodeAction } from '@crui/core/types'

export type MorphingR = {
    morphing: true
}

export type NoMorphingR<E extends AnyNodeAction> =
    NoRestr<MorphingR, E>