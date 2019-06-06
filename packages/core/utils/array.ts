export function last<T>(list: T[]): T|null {
    return (list.length === 0) ? null : list[list.length-1]
}

export function remove<T>(list: T[], elem: T): void {
    const i = list.indexOf(elem)
    if (i !== -1)
        list.splice(i, 1)
}