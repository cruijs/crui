import { InsertAtDriver, InsertAtType } from './index'

export const insertAtDriver: InsertAtDriver<Node> = {
    [InsertAtType]: (parent, { node, index }) => {
        parent.insertBefore(node, parent.childNodes[index])
        return parent
    }
}