import { SimpleNode } from '../../dom/simpleNode'
import { InsertAtRefDriver, InsertAtRefType } from './action'
import { InsertAt, insertAt } from '../insertAt'

export const insertAtRefDriver: InsertAtRefDriver<SimpleNode, InsertAt<SimpleNode>> = {
    [InsertAtRefType]: (parent, { node, ref, index }, { emit }) => {
        const offset = indexOfRef(parent, ref)
        if (offset === undefined)
            throw new Error('Ref is not a children of Parent')

        emit(parent, insertAt(node, offset + 1 + index))
    }
}

function indexOfRef(parent: SimpleNode, ref: SimpleNode): number|undefined {
    const len = parent.childNodes.length
    for (let i = 0; i < len; ++i)
        if (parent.childNodes[i] === ref)
            return i

    return undefined
}