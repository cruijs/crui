import { AsyncFn, DOM, Node, Setup, Tag } from '@crui/core/dom';
import { asyncBind } from '@crui/core/utils/combine';
import { modLifecycle } from '../core/dom/rendered';

export type TransitionMaker = <N extends Node<Tag>>(node: N, dom: DOM<N>) => Transition
export type Transition = {
    intro: Ro,
    outro: Ro,
}
export type Ro = {
    run: AsyncFn,
    cancel: () => void,
}

enum Running {
    Intro,
    Outro
}

/**
 * Create a generic Transition to apply to a Component
 */
export function tx<T extends Tag>(tm: TransitionMaker): Setup<T> {
    return (dom, node) => modLifecycle((m) => {
        const onMounted = m.onMounted
        const onUnmount = m.onUnmount

        const t = tm(node, dom)
        let running = Running.Intro

        m.onMounted = asyncBind(
            () => {
                running = Running.Intro
                t.outro.cancel()
                return t.intro.run()
            },
            () => (
                running === Running.Intro ?
                    onMounted() : Promise.resolve()
            ),
        )
        m.onUnmount = asyncBind(
            () => {
                running = Running.Outro
                t.intro.cancel()
                return onUnmount()
            },
            () => (
                running === Running.Outro ?
                    t.outro.run() : Promise.resolve()
            )
        )
    })
}