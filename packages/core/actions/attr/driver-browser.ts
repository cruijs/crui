import { AttrDriver, AttrType } from './index'

export const attrDriver: AttrDriver<Element> = {
    [AttrType]: (node, { name, value }) => {
        node.setAttribute(name, value)
    }
}