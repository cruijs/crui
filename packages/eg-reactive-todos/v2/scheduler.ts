import { Fn0 } from '../../core/utils/combine';
import { Deferred, dependsOn } from './deferred';
import { Emitter } from './emitter';
import { AnyAction, Drivers } from './types';

export function schedule<N, A extends AnyAction, D extends Drivers<N>>(
    onNext: (w: Fn0) => void,
    node: N,
    driver: D,
    action: A,
): void {
    type Item  = {
        node: N,
        action: AnyAction,
        deferred: Deferred<N>
    }

    let nextBatch: Item[] = []
    const syncEmit = (node: N, action: AnyAction) => {
        const deferred = new Deferred<N>()
        nextBatch.push({ node, action, deferred })
        return deferred
    }
    syncEmit(node, action as any)

    const asyncEmit = (node: N, action: AnyAction) => {
        onNext(exec)
        const t = syncEmit(node, action)
        emitter.emit = syncEmit
        return t
    }

    const emitter: Emitter<N> = {
        emit: syncEmit,
        emitAll: (node, actions) => {
            let counter = actions.length
            const collected: N[] = new Array(counter)
            const deferred = new Deferred<N[]>()

            actions.forEach((a, i) => {
                emitter.emit(node, a).then = (n) => {
                    collected[i] = n
                    if (--counter === 0) {
                        deferred.done(collected)
                    }
                }
            })

            return deferred
        }
    }

    const exec = () => {
        while (nextBatch.length !== 0) {
            const batch = nextBatch
            nextBatch = []

            batch.forEach(({ node, action, deferred }) => {
                const dn = driver[action.type](node, action, emitter)
                if (dn instanceof Deferred) {
                    dependsOn(dn, deferred)
                }
                else {
                    deferred.done(dn)
                }
            })
        }
        emitter.emit = asyncEmit
    }
    exec()
}