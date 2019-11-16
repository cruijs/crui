import { EventHandler } from '../actions/event'
import { remove } from '../utils/array'

type Obj = { [k: string]: any }
type Events = { [k: string]: EventHandler[] }

export class MockNode {
    public tag: string
    public parentNode: MockNode|null
    public childNodes: MockNode[]
    public attrs: Obj = {}
    public props: Obj = {}
    public events: Events = {}
    public style: Obj = {}
    public value: string = ""

    constructor(tag: string) {
        this.tag = tag
        this.childNodes = []
        this.parentNode = null
    }

    setParent(parent: MockNode|null) {
        this.assertParent(parent)
        this.detach()
        
        this.parentNode = parent
    }

    detach() {
        if (this.parentNode)
            remove(this.parentNode.childNodes, this)
        this.parentNode = null
    }

    attach(parent: MockNode) {
        this.setParent(parent)
        parent.childNodes.push(this)
    }

    attachAt(parent: MockNode, index: number) {
        this.setParent(parent)
        parent.childNodes.splice(index, 0, this)
    }

    protected assertParent(parent: MockNode|null) {
        if (parent && (parent.tag === 'text' || parent.tag === 'emptyNode'))
            throw new Error(`Parent node '${parent.tag}' does not support children`)
    }

    cloneNode(_: true) {
        return { ...this }
    }
}