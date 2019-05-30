import { onClick } from '@crui/core/combinators/events';
import { hc } from '@crui/core/elems/children';
import { text } from '@crui/core/elems/text';
import { h, hss } from '@crui/css-emotion';
import { $bindVal } from '@crui/reactive/combinators/$bind';
import { TodoStore } from '../store';

const input = () => hss('input', {
    width: '13rem'
})
const submit = () => h('button', {
    css: {
        marginLeft: '0.5rem',
    },
    children: [
        text('Add')
    ],
})
export function AddTodo(store: TodoStore) {
    return hc('div', [
        $bindVal(input(), store.input),
        onClick(submit(), (e) => {
            e.preventDefault()

            store.addTodo(store.input.get())
            store.input.set('')
        })
    ])
}