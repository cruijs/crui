import { Component, DOM } from '@crui/core/dom';
import { AsyncFn } from '@crui/core/types';
import { asyncBind } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';

export type TransitionMaker = <N>(node: N, dom: DOM<N>) => Transition
export type Ro = {
    run: AsyncFn,
    cancel: () => void,
}
export type Transition = {
    intro: Ro,
    outro: Ro,
}

enum Running {
    Intro,
    Outro
}

type Animation = <C, M>(c: Component<C, M>) => Component<C, M>
/**
 * Create a generic Transition to apply to a Component
 */
export function tx(tm: TransitionMaker): Animation {
    return (comp) => (dom, ctxt) => (
        modify(comp(dom, ctxt), (m) => {
            const t = tm(m.node, dom)

            modify(m.lfc, (l) => {
                let running = Running.Intro
                const onMounted = l.onMounted
                const onUnmount = l.onUnmount

                l.onMounted = asyncBind(
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
                l.onUnmount = asyncBind(
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
        })
    )
}