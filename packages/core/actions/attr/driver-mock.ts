import { MockNode } from '../../tests/mockNode'
import { AttrDriver, AttrType } from './index'

export const attrDriver: AttrDriver<MockNode> = {
    [AttrType]: (node, { name, value }) => {
        node.attrs[name] = value
    }
}