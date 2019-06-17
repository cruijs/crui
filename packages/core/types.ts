export type Tag = string
export type AnyTag = string
export type Node<T extends Tag> = { nodeName: T }
export type AnyNode = Node<AnyTag>
export type Unsubscribe = () => void
export type AsyncFn = () => PromiseLike<void>
