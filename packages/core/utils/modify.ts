export type Modifiable<T> = {
    -readonly [K in keyof T]: T[K]
}
export type Modify<T> = (m: Modifiable<T>) => void
export function modify<T>(obj: T, f: Modify<T>): T {
    f(obj)
    return obj
}

export function alter<A, B>(obj: A, f: Modify<B>): B {
    return modify(obj as any, f)
}