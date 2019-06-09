import { combine } from '@crui/core/utils/combine';
import { Cond$, ReadStream } from '../types';
import { StreamBox } from './stream';

export function some(list: Cond$[]): Cond$ {
    let cur: number|null = findIndex(list)
    const z = new StreamBox(cur !== null)

    const unsubs = list.map((b, i) => {
        b.subscribe((val) => {
            if (cur === null && val) {
                cur = i
                z.set(true)
            }
            else if (cur === i) {
                cur = findIndex(list)
                z.set(cur !== null)
            }
        })
        return b.destroy
    })
    z.addUnsub(combine(unsubs))

    return z
}

function findIndex(list: ReadStream<boolean>[]): number|null {
    for (let i = 0; i < list.length; ++i)
        if (list[i].get() === true)
            return i
    return null
}