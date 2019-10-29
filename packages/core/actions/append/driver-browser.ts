import { AppendType, AppendDriver } from './index'

export const appendDriver: AppendDriver<Node> = {
    [AppendType]: (parent, { node }) => {
        parent.appendChild(node)
    }
}