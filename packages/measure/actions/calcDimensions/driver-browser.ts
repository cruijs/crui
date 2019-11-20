import { CalcDimensionsDriver, CalcDimensionsType } from './action'

export const calcDimensionsDriver: CalcDimensionsDriver<Element> = {
    [CalcDimensionsType]: (node) => {
        const rect = node.getBoundingClientRect()
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            bottom: rect.bottom + window.scrollY,
            right: rect.right + window.scrollX,
            width: rect.width,
            height: rect.height,
        }
    }
}