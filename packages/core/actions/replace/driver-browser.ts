import { destroy } from '../destroyable'
import { ReplaceDriver, ReplaceType } from './index'

export const replaceDriver: ReplaceDriver<Node> = {
    [ReplaceType]: (parent, { prev, next }, { emit }) => {
        parent.replaceChild(next, prev)
        emit(prev, destroy)
    }
}