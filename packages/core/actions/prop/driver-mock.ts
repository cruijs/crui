import { MockNode } from '../../tests/mockNode'
import { PropDriver, PropType } from './index'

export const propDriver: PropDriver<MockNode> = {
    [PropType]: (node, { name, value }) => {
        node.props[name] = value
    }
}