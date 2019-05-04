import { Unsubscribe } from '../../../src/type';
import { runAll } from '../../../src/utils';
import { StreamBox } from './rx/box';
import { filter } from './rx/list/filter';
import { Predicate } from './rx/list/filter/types';
import { StreamList } from './rx/list/index';

export type Todo = {
    done: StreamBox<boolean>,
    text: string,
}

export type TodoList = StreamList<Todo>
export enum Visibility {
    ALL,
    DONE,
    TODO,
}
export class TodoStore {
    public readonly input: StreamBox<string>
    public readonly visibility: StreamBox<Visibility>

    private readonly todos: TodoList
    private readonly visibleTodos: TodoList
    private readonly unsubs: Unsubscribe[]
    private completed?: TodoList
    private uncompleted?: TodoList

    constructor() {
        this.input = new StreamBox('')
        this.todos = new StreamList<Todo>([])
        this.visibleTodos = new StreamList<Todo>([])
        this.visibility = new StreamBox<Visibility>(Visibility.ALL)
        this.unsubs = [
            () => {},
            this.visibility.subscribe(
                this.setListByVisiblity
            )
        ]
        this.setListByVisibility(Visibility.ALL)
    }

    getTodos() {
        return this.visibleTodos
    }

    private setListByVisibility = (v: Visibility) => {
        this.unsubs[0]()
        this.unsubs[0] = keepSynced(
            this.getTodoByVisibility(v),
            this.visibleTodos
        )
    }

    private getTodoByVisibility(v: Visibility) {
        switch (v) {
            case Visibility.ALL:
                return this.todos
            case Visibility.DONE:
                return this.getCompleted()
            case Visibility.TODO:
                return this.getUncompleted()
        }
    }

    private getCompleted(): TodoList {
        if (!this.completed) {
            this.completed = this.makeFiltered((todo) => todo.done.get())
        }
        return this.completed
    }

    private getUncompleted(): TodoList {
        if (!this.uncompleted) {
            this.uncompleted = this.makeFiltered((todo) => !todo.done)
        }
        return this.uncompleted
    }

    addTodo(todo: string): void {
        this.todos.push({
            text: todo,
            done: new StreamBox<boolean>(false)
        })
    }

    private makeFiltered(p: Predicate<Todo>) {
        const { unsub, list } = filter(this.todos, p)
        this.unsubs.push(unsub)
        return list
    }

    dispose() {
        runAll(this.unsubs)
    }
}