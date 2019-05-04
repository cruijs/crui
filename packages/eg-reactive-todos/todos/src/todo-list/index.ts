import { h } from '../../../../src/h/index';
import { h$map } from '../../../../src/elems/list';
import { TodoStore, Todo } from '../store'
import { Component } from '../../../../src/dom/index'
import { hc } from '../../../../src';
import { Stream } from '../../../../src/type';
import { text } from '../../../../src/h/text'

export function TodoList(store: TodoStore) {
    return h$map(
        h('ul'),
        store.getTodos(),
        Todo
    )
}

function Todo(todo: Todo): Component {
    return hc('li', [
        hc('label', [
            hc('span', [
                text(todo.text)
            ]),
            h('input', {
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