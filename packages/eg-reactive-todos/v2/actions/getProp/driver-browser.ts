import { GetPropDriver, GetPropType } from './index'

export const getPropDriver: GetPropDriver<any, Element> = {
    [GetPropType]: (node, { name }) => {
        return node[name]
    }
}