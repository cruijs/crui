import { ReplaceDriver, ReplaceType } from './index'

export const replaceDriver: ReplaceDriver<Node> = {
    [ReplaceType]: (parent, { prev, next }) => {
        parent.replaceChild(next, prev)
    }
}