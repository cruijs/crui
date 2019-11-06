import { GetPropDriver, GetPropType } from './index'

export const getPropDriver: GetPropDriver<any, any> = {
    [GetPropType]: (node, { name }) => {
        return node.props[name]
    }
}