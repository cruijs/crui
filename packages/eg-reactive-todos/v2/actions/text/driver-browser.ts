import { append, Append } from '../append'
import { TextDriver, TextType } from './index'

export const textDriver: TextDriver<Node, Text, Append<Node>> = {
    [TextType]: (parent, { data }, { emit }) => {
        const tn = document.createTextNode(data)
        emit(parent, append(tn))
        return tn
    }
}