import { opsApply } from '../../../operations/apply';
import { StreamList } from '../../../stream';
import { diff } from '..';

type Item = { n: number }
describe(diff, () => {
    describe('combined with opsApply', () => {
        for (let i = 0; i < 20; ++i) {
            const src = randomList()
            const prev = itemise(src)
            const target = buildTarget(prev) 
            const title = "\nsrc: "
                + JSON.stringify(src)
                + "\ntarget: "
                + JSON.stringify(target.map((item) => item.n))

            describe(title, () => {
                it('becomes target', () => {
                    const $list = new StreamList(prev)

                    opsApply($list, diff(prev, target))

                    expect($list.get()).toEqual(target)
                })
            })
        }
    })
})

function randomList(): number[] {
    const len = 100
    const list = new Array<number>(len)
    for (let i = 0; i < len; ++i)
        list[i] = rand(100)

    return list
}

function buildTarget(ns: Item[]): Item[] {
    return sort(addNew(remove(ns)))
}

function itemise(ns: number[]): Item[] {
    return ns.map((n) => ({ n }))
}

function sort(ns: Item[]): Item[] {
    return ns.sort(() => rand(2) - 1)
}

function addNew(ns: Item[]): Item[] {
    const len = rand(ns.length * 0.25)

    const xs = new Array<Item>(len)
    for (let i = 0; i < len; ++i) {
        xs[i] = { n: 500 + rand(100) }
    }

    return ns.concat(xs)
}

function remove(ns: Item[]): Item[] {
    const end = ns.length - rand(ns.length * 0.25)
    return ns.slice(0, end)
}

function rand(max: number): number {
    return Math.round(Math.random() * max)
}