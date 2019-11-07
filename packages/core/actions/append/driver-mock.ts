import { MockNode } from '../../mocks/mockNode'
import { AppendDriver, AppendType } from './index'

export const appendDriver: AppendDriver<MockNode> = {
    [AppendType]: (parent, { node }) => {
        parent.childNodes.push(node)
        node.setParent(parent)
    }
}