import { bind } from '../../utils/deferred'
import { noop } from '../../utils/noop'
import { append } from '../append'
import { MountDriver, MountType } from './mount'
import { mounted, MountedDriver, MountedType } from './mounted'

export const makeMountDriver = <N>(): MountedDriver<N> & MountDriver<N> => ({
    [MountedType]: noop,
    [MountType]: (root, { elem }, { emit }) => bind(
        emit(root, elem),
        (node) => bind(
            emit(root, append(node)),
            () => emit(node, mounted)
        )
    ),
})