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

export function compatibleInputEvent<E>(elem: E): string {
    const notFullySupported = 
        elem instanceof HTMLSelectElement
        || elem instanceof HTMLInputElement && (
            elem.type === 'checkbox' || elem.type === 'radio'
        )

    return (notFullySupported) ? 'change' : 'input'
}