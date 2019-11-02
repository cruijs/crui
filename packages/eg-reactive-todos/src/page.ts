import { h, hc, text } from '@crui/core';
import { css } from '@crui/css-emotion';
import { AddTodo } from './add-todo';
import { Footer } from './footer';
import { TodoStore } from './store';
import { TodoList } from './todo-list';

const Title = h('h1', [css({ textAlign: 'center', marginBottom: '2rem' })], [
    text('CRUI - Todo')
])
export const TodoPage = (store: TodoStore) => 
    hc('div', [
        Title,
        AddTodo(store),
        TodoList(store),
        Footer(store),
    ])