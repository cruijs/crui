import { dynNode, dynSetup, h, hc, text } from '@crui/core';
import { css } from '@crui/css-emotion';
import { bindChecked, listView } from '@crui/reactive';
import { Todo, TodoStore } from '../store';

export function TodoList(store: TodoStore) {
    return h('ul', [
        css({
            listStyle: 'none',
            padding: 0,
            margin: 0,
            paddingTop: '0.5rem',
        }),
        listView(
            store.getVisibleTodos(),
            TodoTemplate(),
        ),
    ])
}

function TodoTemplate() {
    return h('label', [
        css({
            display: 'block',
            backgroundColor: 'aliceblue',
            padding: '0.25rem 0.5rem',
            marginBottom: '0.5rem',
            cursor: 'pointer',
        }),
    ], [
        h('input', [
            dynSetup((todo: Todo) =>
                bindChecked(todo.done)
            ),
            css({
                verticalAlign: 'middle',
                marginRight: '0.5rem',
            }),
        ]),
        hc('span', [
            dynNode((todo: Todo) => text(todo.text))
        ])
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