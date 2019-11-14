import { AnyNodeAction, Append, CreateTag, replace, Replace, ReplaceDriver, ReplaceType } from '@crui/core';
import { bind, completed, pipe, then } from '@crui/core/utils/deferred';
import { Suspender } from '../../suspender';
import { Suspend, SuspendDriver, SuspendType } from './suspend';
import { WaitForDriver, WaitForType } from './waitFor';

export function makeSuspendDriver<
    N,
    L extends AnyNodeAction = any,
    E extends AnyNodeAction = any,
    A extends AnyNodeAction = any,
>(
): SuspendDriver<
    N, L, E, A, 
    Suspend<L, E, A>|Append<N>|Replace<N>|CreateTag<N>,
    ReplaceDriver<N>
> {
    return {
        [SuspendType]: (parent, { loader, error, asyncNode }, emitter) => {
            const suspender = new Suspender()

            let root: N|undefined
            const handleAsync = (node: N) => {
                root = node
                return then(
                    emitter.emit(parent, loader),
                    (stub) => {
                        suspender.waitAll().then(
                            () => {
                                emitter.emit(parent, replace(stub, root!))
                                root = undefined
                            },
                            (e: Error) => {
                                pipe(
                                    emitter.emit(parent, error(e)),
                                    (errNode) => emitter.emit(parent, replace(stub, errNode))
                                )
                                root = undefined
                            }
                        )
                    }
                )
            }

            const provideDriver = <D extends ReplaceDriver<N>>(d: Readonly<D>): D & WaitForDriver<N> => ({
                ...d,
                [WaitForType]: (_, { promise }) => {
                    suspender.waitFor(promise)
                },
                [ReplaceType]: (p, action, emitter) => {
                    if (p === parent && action.prev === root)
                        root = action.next
                    else
                        d[ReplaceType](p, action, emitter)
                }
            })

            return bind(
                emitter.withDrivers(provideDriver).emit(parent, asyncNode),
                (node) => 
                    suspender.nothingToWaitFor() 
                        ? completed(node) 
                        : handleAsync(node)
            )
        }
    }
}