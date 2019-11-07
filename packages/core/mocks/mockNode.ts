import { EventHandler } from '../actions/event'
import { remove } from '../utils/array'

type Obj = { [k: string]: any }
type Events = { [k: string]: EventHandler[] }

export class MockNode {
    public tag: string
    public parentNode: this|null
    public childNodes: this[]
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

    setParent(parent: this|null = null) {
        if (this.parentNode)
            remove(this.parentNode.childNodes, this)

        this.parentNode = parent
    }

    cloneNode(_: true) {
        return { ...this }
    }
}