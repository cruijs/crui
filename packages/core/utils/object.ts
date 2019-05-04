export function keys<O, K extends keyof O>(obj: O): K[] {
    return Object.keys(obj) as any
}