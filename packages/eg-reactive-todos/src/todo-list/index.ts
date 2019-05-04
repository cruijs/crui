import { Component } from '@crui/core/dom';
import { e } from '@crui/core/elems/elem';
import { text } from '@crui/core/elems/text';
import { hc } from '@crui/core/elems/withChildren';
import { h$ } from '@crui/reactive/elems';
import { h$map } from '@crui/reactive/elems/h$map';
import { Todo, TodoStore } from '../store';

export function TodoList(store: TodoStore) {
    return h$map(
        e('ul'),
        store.getTodos(),
        TodoComponent
    )
}

function TodoComponent(todo: Todo): Component {
    return hc('li', [
        hc('label', [
            hc('span', [
                text(todo.text)
            ]),
            h$('input', {
                props: {
                    type: 'checkbox',
                },
                $bind: {
                    checked: todo.done
                }
            })
        ])
    ])
}