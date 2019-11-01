import { Cleanup, cleanup, text, TextElem, then } from '@crui/core'
import { apply } from '../../rx/box/apply'
import { SetNodeValue, setNodeValue } from '../setNodeValue'
import { $TextDriver, $TextType } from './index'

export const make$TextDriver = <N>(): $TextDriver<N, TextElem|SetNodeValue|Cleanup> => ({
    [$TextType]: (parent, { stream }, { emit }) => (
        then(
            emit(parent, text(stream.get())), 
            (node) => {
                apply(stream, (data) => {
                    emit(node, setNodeValue(data))
                })
                emit(node, cleanup(stream.destroy))
            }
        )
    )
})