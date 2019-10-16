import { css, cx } from 'emotion'
import { CssDriver, CssType } from './index'

export const cssDriver: CssDriver<Element> = {
    [CssType]: (node, { style }) => {
        node.className = cx(...[
            ...node.classList.values(),
            css(style)
        ])

        return node
    }
}