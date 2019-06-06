export function keys<O, K extends keyof O>(obj: O): K[] {
    return Object.keys(obj) as any
}

export function assign<T, S>(target: T, source: S): void {
    keys(source).forEach((k) => {
        (target as any)[k] = source[k]
    })
}

export function equals<T extends {}>(a: T, b: T): boolean {
    const ks = keys(a)
    if (ks.length !== Object.keys(b).length) {
        return false
    }

    for (const k of ks) {
        if (a[k] !== b[k]) {
            return false
        }
    }

    return true
}

export function map<T extends {}, K extends keyof T, P>(obj: T, f: (v: T[K]) => P): P[] {
    return keys(obj).map((k) => f(obj[k] as T[K]))
}