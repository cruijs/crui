import { mount } from '@crui/core/dom/browser'
import { TodoPage } from './src/page';
import { TodoStore } from './src/store'

mount(
    document.querySelector('#root'),
    TodoPage(new TodoStore),
    {}
)