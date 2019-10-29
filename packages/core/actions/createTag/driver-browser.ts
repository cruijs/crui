import { CreateTagDriver, CreateTagType } from './index'

export const createTagDriver: CreateTagDriver<HTMLElement> = {
    [CreateTagType]: (_, { tag }) => {
        return document.createElement(tag)
    }
}