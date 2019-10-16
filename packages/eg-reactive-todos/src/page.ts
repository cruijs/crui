import { AddTodo } from './add-todo';
import { Footer } from './footer';
import { TodoStore } from './store';
import { TodoList } from './todo-list';
import { h } from '../v2/actions/elem';
import { css } from '../v2/actions/css';
import { text } from '../v2/actions/text';

export const TodoPage = (store: TodoStore) => 
    h('div', [
        h('h1', [
            css({ textAlign: 'center', marginBottom: '2rem' }),
            text('CRUI - Todo')
        ]),
        AddTodo(store),
        TodoList(store),
        Footer(store),
    ])