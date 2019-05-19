import { h } from '@crui/core/elems';
import { hc } from '@crui/core/elems/children';
import { h$ } from '@crui/reactive/elems';
import { TodoStore } from '../store';
import { text } from '@crui/core/elems/text';

export function AddTodo(store: TodoStore) {
    const input = h$('input', {
        props: { className: 'add-todo-input' },
        $bind: { value: store.input }
    })

    const submit = h('button', {
        props: { className: 'add-todo-submit' },
        events: {
            click: (e) => {
                e.preventDefault()

                store.addTodo(store.input.get())
                store.input.set('')
            }
        },
        children: [
            text('Add')
        ]
    })

    return hc('div', [
        input,
        submit
    ])
}