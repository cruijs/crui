import { DOM } from '@crui/core/dom';
import { Style } from '@crui/core/dom/style';
import { combine } from '@crui/core/utils/combine';
import { noop } from '@crui/core/utils/noop';
import { keys } from '@crui/core/utils/object';
import { tx } from './index';

type Milliseconds<T> = {[K in keyof T]: number}

/**
 * Create a CSS Transition to apply to a Component
 */
export const cssTx = <P extends keyof Style>(
    transitions: Milliseconds<Pick<Required<Style>, P>>,
    fromStyle: Pick<Required<Style>, P>, 
    toStyle: Pick<Required<Style>, P>
) => tx((node, dom) => {
    const props = keys(transitions)

    dom.applyStyle(node, fromStyle)
    dom.modStyle(node, (s) => {
        let trans = props
            .map((k) => `${k} ${transitions[k]}ms`)
            .join(',')
        if (s.transition) {
            trans = s.transition + ', ' + trans
        }
        s.transition = trans
    })

    const slowest = props.reduce(
        (z, k) => transitions[k] > transitions[z] ? k : z,
        props[0]
    )

    return {
        intro: onTrans(dom, node, toStyle, slowest),
        outro: onTrans(dom, node, fromStyle, slowest)
    }
})

export const onTrans = <N, S extends keyof Style>(
    dom: DOM<N>,
    node: N,
    style: Pick<Style, S>,
    slowest: string,
) => {
    let done = noop
    let unsub = noop
    const cancel = () => {
        unsub()
        done()
        done = unsub = noop
    }
    const run = () => {
        const handler = (e: Event) => {
            if (!(e instanceof TransitionEvent))
                return

            if (e.propertyName !== slowest)
                return

            cancel()
        }
        /**
         * When clicking around, it's possible for long transitions to not trigger
         * because property are already set to target value, so this hack ensures 
         * that this edge case is handled.
         */
        const timeout = setTimeout(cancel, 100)
        unsub = combine([
            () => { if (timeout) clearTimeout(timeout) },
            dom.listen(node, 'transitionend', handler),
            dom.listen(node, 'transitionrun', () => {
                if (timeout) clearTimeout(timeout)
            })
        ])
        return new Promise<void>((resolve) => {
            dom.applyStyle(node, style)
            done = resolve
        })
    }
    return { run, cancel }
}