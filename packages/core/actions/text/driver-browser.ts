import { TextDriver, TextType } from './index'

export const textDriver: TextDriver<Node, Text> = {
    [TextType]: (_, { data }) => {
        return document.createTextNode(data)
    }
}