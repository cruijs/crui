import { Fn0 } from '../../core/utils/combine';
import { Deferred, dependsOn } from './deferred';
import { Emit, Emitter, Job } from './emitter';
import { AnyAction, Drivers } from './types';

export function schedule<N, A extends AnyAction, D extends Drivers<N>>(
    onNext: (w: Fn0) => void,
    node: N,
    drivers: D,
    action: A,
): void {
    let nextBatch: Job<N>[] = []
    const syncEmit: Emit<N> = (job) => {
        nextBatch.push(job)
    }
    const asyncEmit: Emit<N> = (job) => {
        onNext(exec)
        syncEmit(job)
        curEmit = syncEmit
    }
    let curEmit: Emit<N> = syncEmit
    const emit: Emit<N> = (job) => curEmit(job)
    const emitter = new Emitter(drivers, emit)

    emitter.emit(node, action)

    const exec = () => {
        while (nextBatch.length !== 0) {
            const batch = nextBatch
            nextBatch = []

            batch.forEach(({ node, action, deferred, drivers, emitter }) => {
                const dn = drivers[action.type](node, action, emitter)
                if (dn instanceof Deferred) {
                    dependsOn(dn, deferred)
                }
                else {
                    deferred.done(dn)
                }
            })
        }
        curEmit = asyncEmit
    }
    exec()
}