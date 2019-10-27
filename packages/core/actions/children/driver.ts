import { Elem } from '../elem'
import { ChildrenDriver, ChildrenType } from './index'

export const childrenDriver: ChildrenDriver<Elem<any, any>> = {
    [ChildrenType]: (node, { children }, { emitAll }) => {
        return emitAll(node, children)
    }
}