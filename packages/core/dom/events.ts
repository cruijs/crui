type Event = {
    target?: {
        value: string
    }
}
export function getValue(e: Event): string {
    const inp = e.target
    if (inp == null) {
        return ''
    }
    return inp.value
}