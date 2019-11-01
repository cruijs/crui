import { FocusDriver, FocusType } from './index'

export const focusDriver: FocusDriver<HTMLElement> = {
    [FocusType]: (node, { signal }) => {
        signal.subscribe(() => {
            node.focus()
        })
    }
}