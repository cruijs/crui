import { Fn0 } from '../types'
import { noop } from './noop'

export function combine(fs: Fn0[]): Fn0 {
    if (fs.length === 0) {
        return noop
    }
    if (fs.length === 1) {
        return fs[0]
    }
    return () => {
        for(const f of fs)
            f()
    }
}

export function combine2(a: Fn0, b: Fn0): Fn0 {
    if (a === noop) {
        return b
    }
    if (b === noop) {
        return a
    }
    return () => {
        a()
        b()
    }
}

export function runAll(fs: Fn0[]): void {
    fs.forEach((f) => f())
}