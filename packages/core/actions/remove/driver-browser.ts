import { RemoveDriver, RemoveType } from './index'

export const removeDriver: RemoveDriver<Node> = {
    [RemoveType]: (parent, { node }) => {
        parent.removeChild(node)
        return parent
    }
}