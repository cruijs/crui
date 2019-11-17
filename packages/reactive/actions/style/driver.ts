import { cleanup, Cleanup, Style, style } from '@crui/core'
import { StyleK } from '@crui/core/dom/style'
import { $StyleDriver, $StyleType } from './action'

export const make$StyleDriver = <N, K extends StyleK = any>(): $StyleDriver<N, K, Style|Cleanup> => ({
    [$StyleType]: (node, { stream, name }, { emit }) => {
        stream.subscribe((s) => {
            emit(node, style(name, s))
        })
        emit(node, cleanup(stream.destroy))
        return emit(node, style(name, stream.get()))
    }
})