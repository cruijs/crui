import { getValue } from '../../../../src/dom/events';
import { h, hc } from '../../../../src/index';
import { TodoStore } from '../store';

export function AddTodo(store: TodoStore) {
    const input = h('input', {
        props: { className: 'add-todo-input' },
        $props: { value: store.input },
        on: {
            change: (e) => { store.input.set(getValue(e)) }
        }
    })
    const submit = h('button', {
        props: { className: 'add-todo-submit' },
        on: {
            click: () => store.addTodo(store.input.get())
        }
    })
    return hc('div', [
        input,
        submit
    ])
}