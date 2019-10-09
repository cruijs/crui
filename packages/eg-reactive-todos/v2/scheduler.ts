import { Deferred, dependsOn } from './deferred';
import { Emitter } from './emitter';
import { AnyAction, Driver, Drivers } from './types';

type DtoS<D> = { [K in keyof D]: InferAction<D[K]> }[keyof D]
type InferAction<FD> = FD extends Driver<any, infer A, any> ? A : never;

export function render<N, A extends AnyAction, D extends A['_d']>(
    node: N,
    driver: D,
    action: A
): void {
    exec(node, driver, action)
}

export function exec<N, A extends AnyAction, D extends Drivers<N>>(
    node: N,
    driver: D,
    action: A
): void {
    type E = Emitter<N, DtoS<D>>
    type A1 = DtoS<D>
    type Item  = {
        node: N,
        action: DtoS<D>
        deferred: Deferred<N>
    }

    let nextBatch: Item[] = []
    const syncEmit = (node: N, action: A1) => {
        const deferred = new Deferred<N>()
        nextBatch.push({ node, action, deferred })
        return deferred
    }
    syncEmit(node, action as any)

    const asyncEmit = (node: N, action: A1) => {
        window.requestAnimationFrame(() => {
            exec()
        })
        const t = syncEmit(node, action)
        emitter.emit = syncEmit
        return t
    }

    const emitter: E = {
        emit: syncEmit,
        emitAll: (node: N, actions: A1[]) => {
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