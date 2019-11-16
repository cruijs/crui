import { MockNode } from '../../mocks/mockNode'
import { InsertAtDriver, InsertAtType } from './index'

export const insertAtDriver: InsertAtDriver<MockNode> = {
    [InsertAtType]: (parent, { node, index }) => {
        node.attachAt(parent, index)
    }
}