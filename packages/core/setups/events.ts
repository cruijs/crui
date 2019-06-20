import { Setup } from '../dom';
import { modLifecycle, result, Meta } from '../dom/rendered'

export type EventHandler = EventListener
export type MouseHandler = (ev: MouseEvent) => void

export type InputType = 'input' | 'change' | 'select' | 'focus' | 'blur'
export type FormType = 'submit'
export type LoadType = 'load' | 'error' | 'abort'
export type MouseType = 'click' | 'mousemove' | 'mousedown' | 'mouseup' | 'mouseenter' | 'mouseleave' | 'mouseout' | 'mouseover'
export type EventType = InputType | FormType | LoadType | MouseType

export type InputTag = 'textarea' | 'input' | 'select'
export type LoadTag = 'img' | 'script'


/**
 * Setup an event handler
 */
export function on(ev: InputType, handler: EventListener): Setup<{}, Meta<InputTag>>
export function on(ev: LoadType, handler: EventListener): Setup<{}, Meta<LoadTag>>
export function on(ev: FormType, handler: EventListener): Setup<{}, Meta<'form'>>
export function on(ev: MouseType, handler: MouseHandler): Setup<{}, Meta<string>>
export function on<E extends EventType>(ev: E, handler: (ev: any) => void): Setup<{}, Meta<any>> {
    return (meta, dom, node) => result(meta, modLifecycle((m) => {
        m.unsub = dom.listen(node, ev, handler)
    }))
}

export function onClick(handler: MouseHandler) {
    return on('click', handler)
}