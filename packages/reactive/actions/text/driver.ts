import { pipe, text, TextElem, Cleanup, cleanup } from '@crui/core'
import { SetNodeValue, setNodeValue } from '../setNodeValue'
import { $TextDriver, $TextType } from './index'

export const make$TextDriver = <N>(): $TextDriver<N, TextElem|SetNodeValue|Cleanup> => ({
    [$TextType]: (parent, { stream }, { emit }) => {
        emit(parent, cleanup(stream.destroy))

        const d = emit(parent, text(stream.get()))
        pipe(d, (node) => {
            stream.subscribe((data) => {
                emit(node, setNodeValue(data))
            })
        })

        return d
    }
})