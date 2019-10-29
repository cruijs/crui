import { Driver, SetupAction, Unsubscribe } from '../../types'
import { action } from '../action'

export const CleanupType = Symbol('cleanup')
export type CleanupDriver<N = any> = {
    [CleanupType]: Driver<N, Cleanup>
}
export type Cleanup = SetupAction<typeof CleanupType, CleanupDriver> & {
    unsub: Unsubscribe,
}

export function cleanup(unsub: Unsubscribe): Cleanup {
    return action({
        type: CleanupType,
        unsub
    })
}