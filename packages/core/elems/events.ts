import { Setup } from '../dom';
import { modLifecycle } from '../dom/rendered';

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
export function on<T extends InputTag>(ev: InputType, handler: EventListener): Setup<T>
export function on<T extends LoadTag>(ev: LoadType, handler: EventListener): Setup<T>
export function on(ev: FormType, handler: EventListener): Setup<'form'>
export function on(ev: MouseType, handler: MouseHandler): Setup
export function on<E extends EventType>(ev: E, handler: (ev: any) => void): Setup {
    return (dom, node) =>
        modLifecycle((m) => {
            m.unsub = dom.listen(node, ev, handler)
        })
}

export function onClick(handler: MouseHandler) {
    return on('click', handler)
}