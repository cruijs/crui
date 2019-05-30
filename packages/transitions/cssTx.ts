import { DOM } from '@crui/core/dom/index';
import { Style } from '@crui/core/dom/style';
import { combine } from '@crui/core/utils/combine';
import { noop } from '@crui/core/utils/noop';
import { keys } from '@crui/core/utils/object';
import { tx } from './index';

type Milliseconds<T> = {[K in keyof T]: number}

export const cssTx = <P extends keyof Style>(
    transitions: Milliseconds<Pick<Required<Style>, P>>,
    fromStyle: Pick<Required<Style>, P>, 
    toStyle: Pick<Required<Style>, P>
) => tx((node, dom) => {
    const props = keys(transitions)

    dom.applyStyle(node, fromStyle)
    dom.applyStyle(node, {
        transition: props
            .map((k) => `${k} ${transitions[k]}ms`)
            .join(',')
    })

    const slowest = props.reduce(
        (z, k) => transitions[k] > transitions[z] ? k : z,
        props[0]
    )

    return {
        intro: onTrans(dom, node, toStyle, slowest),
        outro: onTrans(dom, node, fromStyle, slowest),
    }
})

const onTrans = <N>(
    dom: DOM<N>,
    node: N,
    style: Style,
    slowest: string,
) => () => {
    let done = noop
    const handler = (e: Event) => {
        if (!(e instanceof TransitionEvent))
            return

        if (e.elapsedTime == 0 || e.propertyName !== slowest)
            return

        unsub()
        done()
    }
    const unsub = combine([
        dom.listen(node, 'transitionend', handler),
        dom.listen(node, 'transitioncancel', handler),
    ])

    return new Promise<void>((resolve) => {
        dom.applyStyle(node, style)
        done = resolve
    })
}