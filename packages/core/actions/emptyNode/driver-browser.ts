import { EmptyNodeDriver, EmptyNodeType } from './index'

export const emptyNodeDriver: EmptyNodeDriver<Comment> = {
    [EmptyNodeType]: () => {
        return document.createComment('emptyNode')
    }
}