import { opsApply } from '../../../operations/apply';
import { StreamList } from '../../../stream';
import { diff } from '..';

describe(diff, () => {
    describe('combined with opsApply', () => {
        for (let i = 0; i < 20; ++i) {
            const src = randomList()
            const target = src.filter(() =>
                Math.random() > 0.5
            )
            const title = "\nsrc: "
                + JSON.stringify(src)
                + "\ntarget: "
                + JSON.stringify(target)

            describe(title, () => {
                it('becomes target', () => {
                    const $list = new StreamList(src)

                    opsApply($list, diff(src, target))

                    expect($list.get()).toEqual(target)
                })
            })
        }
    })
})

function randomList(): number[] {
    const len = Math.round(10 + Math.random() * 90)
    const list = Array(len)
    for (let i = 0; i < len; ++i)
        list[i] = Math.round(Math.random() * 100)

    return list
}