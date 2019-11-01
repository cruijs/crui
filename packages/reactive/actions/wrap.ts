import { AnyNodeAction, Destroyable, Memoize } from '@crui/core'

export type Wrap = <E extends AnyNodeAction>(elem: E) => Memoize<E>|Destroyable<E>