import { hc } from '../../../src';
import { AddTodo } from './add-todo';
import { TodoStore } from './store';

export const TodoPage = (store: TodoStore) => 
    hc('div', [
        AddTodo(store),
        TodoList(store),
        Footer(store)
    ])