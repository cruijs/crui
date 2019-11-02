import { AnyNodeAction, emptyElem, memoize } from '@crui/core'
import { Cond$B } from '../../rx/box'
import { ite } from '../ifThenElse'
import { Wrap } from '../wrap'

export function when<T extends AnyNodeAction>(
    cond: Cond$B,
    onTrue: T,
    wrap: Wrap = memoize
) {
    return ite(cond, onTrue, emptyElem, wrap)
}