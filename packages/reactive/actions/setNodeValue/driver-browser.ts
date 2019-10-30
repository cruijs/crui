import { SetNodeValueDriver, SetNodeValueType } from './index'

export const setNodeValueDriver: SetNodeValueDriver<Node> = {
    [SetNodeValueType]: (node, { data }) => {
        node.nodeValue = data
    }
}