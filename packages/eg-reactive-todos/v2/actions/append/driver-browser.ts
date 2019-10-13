import { AppendType, AppendDriver } from '.'

export const appendDriver: AppendDriver<Node> = {
    [AppendType]: (parent, { node }) => {
        document.appendChild(node)
        return parent
    }
}