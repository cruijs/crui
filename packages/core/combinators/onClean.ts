import { Component } from '../dom';
import { Unsubscribe } from '../type';
import { combine2 } from '../utils/combine';
import { modify } from '../utils/modify';

export function onClean<C>(comp: Component<C>, unsub: Unsubscribe): Component<C> {
    return (dom, ctxt) => modify(comp(dom, ctxt), (m) => {
        m.unsub = combine2(m.unsub, unsub)
    })
}