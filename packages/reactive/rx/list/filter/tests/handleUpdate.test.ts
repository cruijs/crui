import { StreamList, UpdateItem, UpdateType } from '../../index';
import { handleUpdate } from '../handleUpdate';
import { Index, Predicate } from '../types';

const isEven: Predicate<number> = (n) => n % 2 === 0
function update(index: number, newValue: number): UpdateItem<number> {
    return {
        type: UpdateType.Update,
        index,
        oldValue: 1,
        newValue,
    }
}
function run(
    state: {
        upd: UpdateItem<number>,
        list: number[],
        imap: Index,
    },
    expected: {
        list: number[],
        imap: Index,
    }
) {
    const $nl = new StreamList(state.list)
    const actual = handleUpdate(state.upd, {
        $nl,
        p: isEven,
        indexMap: state.imap
    })
    expect($nl.get()).toEqual(expected.list)
    expect(actual).toEqual(expected.imap)
}

describe(handleUpdate, () => {
    describe('index is filtered out', () => {
        describe('and new value does not match predicate', () => {
            it('do nothing', () => {
                const upd = update(2, 3)
                const imap = [null, 0]
                const list = [6]
                run({ upd, imap, list }, { imap, list })
            })
        })

        describe('but new value match predicate', () => {
            describe('and is empty', () => {
                it('is added', () => {
                    run({
                        upd: update(0, 4),
                        list: [],
                        imap: [null],
                    }, {
                        list: [4],
                        imap: [0]
                    })
                })
            })

            describe('and should be first', () => {
                it('add it', () => {
                    run({
                        upd: update(0, 4),
                        list: [6],
                        imap: [null, 0],
                    }, {
                        list: [4, 6],
                        imap: [0, 1]
                    })
                })
            })
            describe('and should be in the middle', () => {
                it('add it', () => {
                    run({
                        upd: update(2, 4),
                        list: [2, 6],
                        imap: [null, 0, null, null, 1]
                    }, {
                        list: [2, 4, 6],
                        imap: [null, 0, 1, null, 2]
                    })
                })
            })
            describe('and should be last', () => {
                it('add it', () => {
                    run({
                        upd: update(4, 6),
                        list: [2, 4],
                        imap: [null, 0, 1, null, null]
                    }, {
                        list: [2, 4, 6],
                        imap: [null, 0, 1, null, 2],
                    })
                })
            })
        })
    })

    describe('index matches', () => {
        describe('and value matches too', () => {
            it('update value', () => {
                const upd = update(1, 4)
                const imap = [null, 0]
                const list = [6]
                run({ upd, imap, list }, { imap, list: [4] })
            })
        })

        describe('but value do not match', () => {
            describe('is the only one', () => {
                it('is removed', () => {
                    run({
                        list: [2],
                        imap: [null, 0],
                        upd: update(1, 3),
                    }, {
                        list: [],
                        imap: [null, null]
                    })
                })
            })

            describe('with index at the start', () => {
                it('is removed', () => {
                    run({
                        list: [2, 4],
                        imap: [null, 0, null, 1],
                        upd: update(1, 3),
                    }, {
                        list: [4],
                        imap: [null, null, null, 0]
                    })
                })
            })

            describe('with index in the middle', () => {
                it('is removed', () => {
                    run({
                        list: [2, 4, 6],
                        imap: [0, 1, null, 2, null],
                        upd: update(1, 3),
                    }, {
                        list: [2, 6],
                        imap: [0, null, null, 1, null]
                    })
                })
            })

            describe('with index at the end', () => {
                it('is removed', () => {
                    run({
                        list: [2, 4, 6],
                        imap: [0, 1, 2],
                        upd: update(2, 3),
                    }, {
                        list: [2, 4],
                        imap: [0, 1, null]
                    })
                })
            })
        })
    })
})