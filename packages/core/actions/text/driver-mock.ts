import { TextDriver, TextType } from './index'

export class MockText {
    constructor(public text: string) {}
}

export const textDriver: TextDriver<any, MockText> = {
    [TextType]: (_, { data }) => {
        return new MockText(data)
    }
}