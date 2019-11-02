import { drivers as coreDrivers } from '@crui/core/browser/drivers';
import { render } from '@crui/core/browser/render';
import { drivers as cssDrivers } from '@crui/css-emotion-reactive/browser/drivers';
import { drivers as rxDrivers } from '@crui/reactive/browser/drivers';
import { TodoPage } from './src/page';
import { TodoStore } from './src/store';

const drivers = {
    ...coreDrivers,
    ...rxDrivers,
    ...cssDrivers
}

render(
    document.getElementById('root')!,
    drivers,
    TodoPage((window as any).store = new TodoStore),
)