import { MockNode } from '../../mocks/mockNode'
import { CreateTagDriver, CreateTagType } from './index'

export const createTagDriver: CreateTagDriver<MockNode> = {
    [CreateTagType]: (_, { tag }) => new MockNode(tag)
}