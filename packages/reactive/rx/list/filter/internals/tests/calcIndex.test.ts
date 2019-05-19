import { calcIndex } from '../calcIndex'
import { Index } from '../../types'
import { Splice } from '../../..';
import { UpdateType } from '../../../index'

function run(index: number, imap: Index, expected: number) {
    const splice: Splice<number> = {
        type: UpdateType.Splice,
        removed: [],
        added: [],
        index
    }
    expect(calcIndex(splice, imap)).toEqual(expected)
}


describe(calcIndex, () => {
    describe('empty', () => {
        it('returns 0', () => {
            run(1, [], 0)
        })
    })

    describe('over the end', () => {
        it('returns end + 1 index', () => {
            run(10, [0], 1)
        })
    })

    describe('when item is in list', () => {
        it('returns index in imap', () => {
            run(2, [0, undefined, 1, undefined], 1)
        })
    })

    describe('when item is filtered out', () => {
        describe('and there is a next element', () => {
            it('returns next index', () => {
                run(2, [0, undefined, undefined, 1, undefined], 1)
            })
        })

        describe('and there is no other element after it', () => {
            it('returns index', () => {
                run(1, [0, undefined, undefined], 1)
            })
        })

        describe('and there is no match', () => {
            it('returns index', () => {
                run(1, [undefined, undefined], 1)
            })
        })
    })
})