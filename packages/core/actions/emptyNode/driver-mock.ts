import { MockNode } from '../../mocks/mockNode'
import { EmptyNodeDriver, EmptyNodeType } from './index'

export const emptyNodeDriver: EmptyNodeDriver<MockNode> = {
    [EmptyNodeType]: () => new MockNode('emptyNode')
}