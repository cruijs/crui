import { StyleDriver, StyleType } from './index'

export const styleDriver: StyleDriver<HTMLElement> = {
    [StyleType]: (node, { name, value }) => {
        node.style[name] = value
    }
}