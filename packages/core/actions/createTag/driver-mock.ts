import { MockNode } from '../../tests/mockNode'
import { CreateTagDriver, CreateTagType } from './index'

export const createTagDriver: CreateTagDriver<MockNode> = {
    [CreateTagType]: (_, { tag }) => new MockNode(tag)
}