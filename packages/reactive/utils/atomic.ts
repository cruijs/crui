export type Atomic = <E>(f: (val: E) => void) => (val: E) => void
export function makeAtomic(): Atomic {
    let running = false
    return (f) => (e) => {
        if (running) {
            return
        }
        running = true
        f(e)
        running = false
    }
}