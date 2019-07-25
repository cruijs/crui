import { diff } from '..'
import { StreamList } from '../../../stream'
import { Update } from '../../../types'
import { opsApply } from '../../../operations/apply'
import { opAdd, opRemove, opReplace } from '../../../operations/factory'

function assert(source: number[], target: number[], expected: Update<number>[]) {
    const $list = new StreamList(source)

    expect(diff(
        $list.get(),
        target,
    )).toEqual(expected)

    opsApply($list, expected)
    expect($list.get()).toEqual(target)
}

describe(diff, () => {
    describe('No change', () => {
        it('do nothing', () => {
            assert(
                [1, 2, 3],
                [1, 2, 3],
                []
            )
        })
    })

    describe('Completely different', () => {
        it('replace', () => {
            assert(
                [1, 2, 3],
                [4, 5, 6],
                [opReplace([1, 2, 3], [4, 5, 6])]
            )
        })
    })

    describe('More elements', () => {
        it('add the elements', () => {
            assert(
                [1, 3],
                [1, 2, 3, 4, 5],
                [
                    opAdd(1, [2]),
                    opAdd(3, [4, 5])
                ]
            )
        })
    })

    describe('Less elements', () => {
        it('removes them', () => {
            assert(
                [1, 2, 3, 4, 5],
                [1, 3],
                [
                    opRemove(1, [2]),
                    opRemove(2, [4, 5])
                ]
            )
        })
    })

    describe('Sorting', () => {
        it('swap in the middle', () => {
            assert(
                [1, 2, 3],
                [1, 3, 2],
                [
                    opRemove(1, [2]),
                    opAdd(2, [2])
                ]
            )
        })

        it('swap at the end', () => {
            assert(
                [1, 2, 3],
                [3, 1, 2],
                [
                    opRemove(2, [3]),
                    opAdd(0, [3])
                ]
            )
        })

        it('swap at the start', () => {
            assert(
                [1, 2, 3],
                [2, 3, 1],
                [
                    opRemove(0, [1]),
                    opAdd(2, [1])
                ]
            )
        })
    })

    describe('Filter and Sort', () => {
        it('properly handles it', () => {
            assert(
                [1, 2, 3, 4, 5, 6, 7],
                [9, 1, 0, 8, 3, 7, 2],
                [
                    // [1, 2, 3, 4, 5, 6, 7]
                    opRemove(1, [2]),
                    // [1, 3, 4, 5, 6, 7]
                    opRemove(2, [4, 5, 6]),
                    // [1, 3, 7]
                    opAdd(0, [9]),
                    // [9, 1, 3, 7]
                    opAdd(2, [0, 8]),
                    // [9, 1, 0, 8, 3, 7]
                    opAdd(6, [2]),
                    // [9, 1, 0, 8, 3, 7, 2]
                ]
            )
        })
    })
})

describe('edge cases', () => {
    it('swap position', () => {
        assert(
            [44, 91, 53, 18, 63, 64, 43, 52, 15, 5],
            [53, 44, 91, 18, 63, 64, 43, 15, 52, 587],
            [
                // [44, 91, 53, 18, 63, 64, 43, 52, 15, 5],
                opRemove(2, [53]),
                // [44, 91, 18, 63, 64, 43, 52, 15, 5],
                opRemove(6, [52]),
                // [44, 91, 18, 63, 64, 43, 15, 5],
                opRemove(7, [5]),
                // [44, 91, 18, 63, 64, 43, 15],
                opAdd(0, [53]),
                // [53, 44, 91, 18, 63, 64, 43, 15],
                opAdd(8, [52, 587]),
            ]
        )
    })

    it('swap position 2', () => {
        assert(
            [98, 56, 87, 33, 9],
            [98, 87, 56, 33],
            [
                // [98, 56, 87, 33, 9],
                opRemove(1, [56]),
                // [98, 87, 33, 9],
                opRemove(3, [9]),
                // [98, 87, 33],
                opAdd(2, [56])
                // [98, 87, 56, 33],
            ]
        )
    })

    it('longer', () => {
        assert(
            [47, 21, 43, 98, 20, 66, 35, 62, 11, 99],
            [35, 47, 43, 20, 58, 98, 21, 62, 11, 99, 66, 56],
            [
                // 0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11
                //[47, 21, 43, 98, 20, 66, 35, 62, 11, 99],
                opRemove(1, [21]),
                //[47, 43, 98, 20, 66, 35, 62, 11, 99],
                opRemove(2, [98]),
                //[47, 43, 20, 66, 35, 62, 11, 99],
                opRemove(3, [66, 35]),
                //[47, 43, 20, 62, 11, 99],
                opAdd(0, [35]),
                //[35, 47, 43, 20, 62, 11, 99],
                opAdd(4, [58, 98, 21]),
                //[35, 47, 43, 20, 58, 98, 21, 62, 11, 99],
                opAdd(10, [66, 56]),
                //[35, 47, 43, 20, 58, 98, 21, 62, 11, 99, 66, 56],
            ]
        )

    })
})