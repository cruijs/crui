import { MockNode } from './mockNode'

export class MockFragment extends MockNode {
    constructor(children: MockNode[]) {
        super('#fragment')
        this.childNodes = children
    }

    setParent(p: MockNode|null) {
        this.assertParent(p)

        this.childNodes.forEach((n) => {
            n.parentNode = p
        })
    }

    detach() {
        throw Error('Fragment cannot be detached')
    }

    attach(parent: MockNode) {
        this.setParent(parent)

        parent.childNodes.push(...this.childNodes)
        this.childNodes = []
    }

    attachAt(parent: MockNode, index: number) {
        this.setParent(parent)

        parent.childNodes.splice(index, 0, ...this.childNodes)
        this.childNodes = []
    }
}