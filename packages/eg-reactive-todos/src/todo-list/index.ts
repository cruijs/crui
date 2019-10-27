import { bindChecked } from '../../v2/actions/bind';
import { css } from '../../v2/actions/css';
import { h } from '../../v2/actions/elem';
import { listView } from '../../v2/actions/rx-list-view';
import { template } from '../../v2/actions/template';
import { dynamic } from '../../v2/actions/template/dynamic';
import { text } from '../../v2/actions/text';
import { Todo, TodoStore } from '../store';

export function TodoList(store: TodoStore) {
    return h('ul', [
        listView(
            store.getVisibleTodos(),
            TodoTemplate(),
        ),
        css({
            listStyle: 'none',
            padding: 0,
            margin: 0,
            paddingTop: '0.5rem',
        })
    ])
}

function TodoTemplate() {
    const child = h('label', [
        css({
            display: 'block',
            backgroundColor: 'aliceblue',
            padding: '0.25rem 0.5rem',
            marginBottom: '0.5rem',
            cursor: 'pointer',
        }),
        h('input', [
            dynamic((todo: Todo) =>
                bindChecked(todo.done)
            ),
            css({
                verticalAlign: 'middle',
                marginRight: '0.5rem',
            }),
        ]),
        h('span', [
            dynamic((todo: Todo) => text(todo.text))
        ])
    ])

    return template<Todo, 'li', typeof child>('li', [
        child
    ])
}
/*
const Remove = cssTx(
    { height: 500, margin: 500, padding: 500 },
    { height: '0', margin: '0', padding: '0' },
    { height: '2rem', margin: null, padding: null },
)
const Slide = cssTx(
    { transform: 500, opacity: 500 },
    { transform: 'translateX(-1em)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 },
)
*/