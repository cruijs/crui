import { hc } from '@crui/core/elems/withChildren';
import { AddTodo } from './add-todo';
import { TodoStore } from './store';
import { TodoList } from './todo-list';

export const TodoPage = (store: TodoStore) => 
    hc('div', [
        AddTodo(store),
        TodoList(store),
        Footer(store)
    ])