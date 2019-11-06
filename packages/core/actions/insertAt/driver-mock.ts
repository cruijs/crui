import { MockNode } from '../../tests/mockNode'
import { InsertAtDriver, InsertAtType } from './index'

export const insertAtDriver: InsertAtDriver<MockNode> = {
    [InsertAtType]: (parent, { node, index }) => {
        parent.childNodes.splice(index, 0, node)
        node.setParent(parent)
    }
}