export function last<T>(list: T[]): T|null {
    return (list.length === 0) ? null : list[list.length-1]
}