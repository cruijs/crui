import { combine } from '@crui/core/utils/combine';
import { StreamBox } from './stream';
import { Cond$B } from './types';

export function every(list: Cond$B[]): Cond$B {
    let count = 0
    const z = new StreamBox<boolean>(false)
    const eff = (val: boolean) => {
        if (val) {
            ++count
            z.set(count === list.length)
        }
        else {
            --count
            z.set(false)
        }
    }
    z.addUnsub(combine(
        list.map((box) => {
            box.apply(eff)
            return box.destroy
        })
    ))
    return z
}