import { MockNode } from '../../tests/mockNode'
import { StyleDriver, StyleType } from './index'

export const styleDriver: StyleDriver<MockNode> = {
    [StyleType]: (node, { name, value }) => {
        node.style[name] = value
    }
}