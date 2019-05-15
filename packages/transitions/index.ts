import { Component, DOM } from '@crui/core/dom';
import { asyncBind } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';

export type TransitionMaker = <N>(node: N, dom: DOM<N>) => Transition
export type Transition = {
    intro: () => PromiseLike<void>
    outro: () => PromiseLike<void>
}

type Animation = <C>(c: Component<C>) => Component<C>
export function tx(tm: TransitionMaker): Animation {
    return (comp) => (dom, ctxt) => {
        const r = comp(dom, ctxt)
        const t = tm(r.node, dom)

        return modify(r, (m) => {
            m.onMounted = asyncBind(
                t.intro,
                m.onMounted,
            )
            m.onUnmount = asyncBind(
                m.onUnmount,
                t.outro
            )
        })
    }
}