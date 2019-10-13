import { PropDriver, PropType } from './index'

export const propDriver: PropDriver<Element> = {
    [PropType]: (node, { name, value }) => {
        node[name] = value
        return node
    }
}