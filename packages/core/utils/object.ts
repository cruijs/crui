export function keys<O, K extends keyof O>(obj: O): K[] {
    return Object.keys(obj) as any
}

export function assign<T, S>(target: T, source: S): void {
    keys(source).forEach((k) => {
        (target as any)[k] = source[k]
    })
}