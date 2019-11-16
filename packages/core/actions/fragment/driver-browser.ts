import { FragmentDriver, FragmentType } from './index';

export const fragmentDriver: FragmentDriver<Node, DocumentFragment> = {
    [FragmentType]: (_, { children }) => {
        const frag = document.createDocumentFragment()
        frag.append(...children)
        return frag
    }
}