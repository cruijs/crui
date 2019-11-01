import { destroy } from '../destroyable'
import { RemoveDriver, RemoveType } from './index'

export const removeDriver: RemoveDriver<Node> = {
    [RemoveType]: (parent, { node }, { emit }) => {
        parent.removeChild(node)
        emit(node, destroy)
    }
}