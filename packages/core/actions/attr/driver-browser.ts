import { AttrDriver, AttrType } from '.'
export const attrDriver: AttrDriver<Element> = {
    [AttrType]: (node, { name, value }) => {
        node.setAttribute(name, value)
        return node
    }
}