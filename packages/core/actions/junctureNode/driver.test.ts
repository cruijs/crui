import { mockDrivers } from '../../mocks/drivers';
import { MockNode } from '../../mocks/mockNode';
import { mockSchedule } from '../../mocks/schedule';
import { testAction } from '../../mocks/test/action';
import { Emitter } from '../../scheduler/emitter';
import { Fn0 } from '../../types';
import { then } from '../../utils/deferred';
import { noop } from '../../utils/noop';
import { append } from '../append/index';
import { onMounted, OnMountedDriver, OnMountedType } from '../mount/onMounted';
import { OnRemoveDriver, OnRemoveType } from '../remove/onRemove';
import { junctureNode } from './action';
import { makeJunctureNodeDriver } from './driver';

let mount: Fn0
const onMountedDriver: OnMountedDriver<MockNode> = {
    [OnMountedType]: (_, { handler }) => {
        mount = handler
    }
}
const onRemoveDriver: OnRemoveDriver<MockNode> = {
    [OnRemoveType]: noop
}
const drivers = {
    ...mockDrivers,
    ...makeJunctureNodeDriver<MockNode>(),
    ...onMountedDriver,
    ...onRemoveDriver,
}

const run = (f: (root: MockNode, e: Emitter<MockNode>) => void) => {
    let emit: Emitter<MockNode>['emit'] | undefined
    const { root, next } = mockSchedule(drivers, testAction((root, e) => {
        then(
            e.emit(root, junctureNode<MockNode>()),
            (e) => {
                f(root, e)
                emit = e.emit
            }
        )
    }))
    if (!emit)
        throw new Error('should never happen')

    return { root, next, emit }
}

describe(junctureNode, () => {
    describe('nothing to mount', () => {
        it('does not trigger anything before initial render', () => {
            const { root } = run((root, { emit }) => {
                const node = new MockNode('test')
                emit(node, onMounted(() => {
                    throw new Error('it should not run')
                }))
                emit(root, append(node))
            })
            expect(root.childNodes[0].tag).toEqual('test')
        })
    })

    describe('onMount', () => {
        it('triggers after initial render', () => {
            let executed = false
            const { root } = run((root, { emit }) => {
                const node = new MockNode('test')
                emit(node, onMounted(() => {
                    executed = true
                }))
                emit(root, append(node))
            })

            const node = root.childNodes[0]
            expect(node.tag).toEqual('test')
            expect(executed).toBe(false)

            mount()
            expect(executed).toBe(true)
        })

        it('does not care about depth', () => {
            let executed = false
            run((root, { emit }) => {
                const nodes = [0, 1, 2, 3, 4].map((n) =>
                    new MockNode(n.toString())
                )
                emit(nodes[4], onMounted(() => {
                    executed = true
                }))
                nodes.reduceRight((c, p) => {
                    emit(p, append(c))
                    return p
                })

                emit(root, append(nodes[0]))
            })
            mount()

            expect(executed).toBe(true)
        })

        it('cascades from parent to child', () => {
            let execOrder: string[] = []

            run((root, { emit }) => {
                const n0 = new MockNode('0')
                const n1 = new MockNode('1')
                const n2 = new MockNode('2')

                const setup = (ns: MockNode[]) => ns.forEach((n) => {
                    emit(n, onMounted(() => {
                        execOrder.push(n.tag)
                    }))
                })
                setup([n0, n2, n1])

                emit(n1, append(n2))
                emit(n0, append(n1))
                emit(root, append(n0))
            })
            mount()

            expect(execOrder).toEqual(['0', '1', '2'])
        })
    })
})