import { TextDriver, TextType } from './index'
import { MockNode } from '../../mocks/mockNode'

export const textDriver: TextDriver<any, MockNode> = {
    [TextType]: (_, { data }) => {
        const node = new MockNode('text')
        node.value = data
        return node
    }
}