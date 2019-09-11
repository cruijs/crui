export function last<T>(list: readonly T[]): T|null {
    return (list.length === 0) ? null : list[list.length-1]
}

export function remove<T>(list: T[], elem: T): void {
    const i = list.indexOf(elem)
    if (i !== -1)
        list.splice(i, 1)
}

export function pushAll<T>(list: T[], add: readonly T[]): T[] {
    const len = list.length
    list.length += add.length

    for (let i = 0; i < add.length; ++i) {
        list[len + i] = add[i]
    }
    return list
}