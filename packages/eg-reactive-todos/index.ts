import { render } from '../../src/index'
import { TodoPage } from './src/page';
import { TodoStore } from './src/store'

render(
    TodoPage( new TodoStore),
    document.querySelector('#root')
)