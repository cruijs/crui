import { h } from '@crui/core/elems';
import { hc } from '@crui/core/elems/children';
import { h$ } from '@crui/reactive/elems';
import { TodoStore } from '../store';

export function AddTodo(store: TodoStore) {
    const input = h$('input', {
        props: { className: 'add-todo-input' },
        $bind: { value: store.input }
    })

    const submit = h('button', {
        props: { className: 'add-todo-submit' },
        events: {
            click: () => {
                store.addTodo(store.input.get())
            }
        }
    })

    return hc('div', [
        input,
        submit
    ])
}