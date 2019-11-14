import { Action, AnySetupAction, Driver, NodeAction, TagMR, TagRM } from '@crui/core'
import { action } from '@crui/core/actions/action'
import { AsyncNodeR } from '../../restriction'

export const ImageType = Symbol('Image')
export type ImageElem<A extends AnySetupAction> = NodeAction<
    typeof ImageType,
    ImageDriver<any, A>,
    AsyncNodeR & TagRM<A>
> & {
    src: string,
    actions: A[]
}

export type ImageDriver<N = any, A extends AnySetupAction = any, S extends Action = never> = {
    [ImageType]: Driver<N, ImageElem<A>, S|A>
}

export function image<A extends AnySetupAction = never>(
    src: string,
    actions: TagMR<A, 'img'>[] = []
): ImageElem<A> {
    return action({
        type: ImageType,
        src,
        actions
    })
}