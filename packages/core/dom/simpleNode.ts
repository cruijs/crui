type List<T> = {
    [index: number]: T
    [Symbol.iterator](): IterableIterator<T>
    length: number
}

export interface SimpleNode {
    parentNode: this|null
    childNodes: List<this>
    cloneNode(deep: boolean): this
}