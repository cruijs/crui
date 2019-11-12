import { AnyNodeAction, Drivers, replace, Replace } from '@crui/core';
import { bind, completed, pipe, then } from '@crui/core/utils/deferred';
import { Suspender } from '../../suspender';
import { SuspendDriver, SuspendType } from './suspend';
import { WaitForDriver, WaitForType } from './waitFor';

export function makeSuspendDriver<
    N,
    L extends AnyNodeAction = any,
    E extends AnyNodeAction = any,
    A extends AnyNodeAction = any,
>(
): SuspendDriver<N, L, E, A, Replace<N>> {
    return {
        [SuspendType]: (root, { loader, error, asyncNode }, emitter) => {
            const suspender = new Suspender()

            const handleAsync = (node: N) => {
                return then(
                    emitter.emit(root, loader),
                    (stub) => {
                        suspender.waitAll().then(
                            () => emitter.emit(root, replace(stub, node)),
                            (e: Error) => pipe(
                                emitter.emit(root, error(e)),
                                (errNode) => emitter.emit(root, replace(stub, errNode))
                            )
                        )
                    }
                )
            }

            const provideDriver = <D extends Drivers>(d: D): D & WaitForDriver => ({
                ...d,
                [WaitForType]: (_, { promise }) => {
                    suspender.waitFor(promise)
                }
            })

            return bind(
                emitter.withDrivers(provideDriver).emit(root, asyncNode),
                (node) => 
                    suspender.nothingToWaitFor() 
                        ? completed(node) 
                        : handleAsync(node)
            )
        }
    }
}