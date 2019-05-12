import { hc } from '@crui/core/elems/children';
import { AddTodo } from './add-todo';
import { Footer } from './footer';
import { TodoStore } from './store';
import { TodoList } from './todo-list';

export const TodoPage = (store: TodoStore) => 
    hc('div', [
        AddTodo(store),
        TodoList(store),
        Footer(store)
    ])