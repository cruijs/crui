import { Action } from '../../types'
import { then } from '../../utils/deferred'
import { MockNode } from '../mockNode'
import { ExtractDriver, ExtractType } from './index'

export type RetValue<T> = {
    value?: T
}
export const makeExtractDriver = <A extends Action = any>(
    ret: RetValue<A['_return']>
): ExtractDriver<MockNode, A> => ({
    [ExtractType]: (node, { wrapped }, { emit }) => {
        return then(emit(node, wrapped), (value) => {
            ret.value = value
        })
    }
})