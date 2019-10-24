import { AppendType, AppendDriver } from '.'

export const appendDriver: AppendDriver<Node> = {
    [AppendType]: (parent, { node }) => {
        parent.appendChild(node)
        return parent
    }
}