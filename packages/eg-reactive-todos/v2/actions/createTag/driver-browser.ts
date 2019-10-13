import { CreateTagDriver, CreateTagType } from '.'

export const createTagDriver: CreateTagDriver<HTMLElement> = {
    [CreateTagType]: (_, { tag }) => {
        return document.createElement(tag)
    }
}