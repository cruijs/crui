import { noop } from '@crui/core/utils/noop';
import { TodoPage } from './src/page';
import { TodoStore } from './src/store';
import { appendDriver } from './v2/actions/append/driver-browser';
import { bindCheckedDriver, bindValueDriver } from './v2/actions/bind/driver';
import { childrenDriver } from './v2/actions/children/driver';
import { CleanupType } from './v2/actions/cleanup/index';
import { createTagDriver } from './v2/actions/createTag/driver-browser';
import { cssDriver } from './v2/actions/css/driver-browser';
import { elemDriver } from './v2/actions/elem/driver';
import { eventDriver } from './v2/actions/event/driver-browser';
import { getPropDriver } from './v2/actions/getProp/driver-browser';
import { insertAtDriver } from './v2/actions/insertAt/driver-browser';
import { propDriver } from './v2/actions/prop/driver-browser';
import { $childrenDriver } from './v2/actions/rx-children/driver';
import { $cssDriver } from './v2/actions/rx-css/driver-browser';
import { makeListViewDriver } from './v2/actions/rx-list-view/driver';
import { makeTemplateDriver } from './v2/actions/template/driver';
import { textDriver } from './v2/actions/text/driver-browser';
import { render } from './v2/render';
import { removeDriver } from './v2/actions/remove/driver-browser'

const drivers = {
    ...createTagDriver,
    ...appendDriver,
    ...insertAtDriver,
    ...removeDriver,
    ...textDriver,
    ...elemDriver,
    ...eventDriver,
    ...bindValueDriver,
    ...bindCheckedDriver,
    ...getPropDriver,
    ...propDriver,
    ...childrenDriver,
    ...cssDriver,
    ...$cssDriver,
    ...$childrenDriver,
    ...makeTemplateDriver(),
    ...makeListViewDriver<Node>(),
    [CleanupType]: noop
}

render(
    document.getElementById('root')!,
    drivers,
    TodoPage((window as any).store = new TodoStore),
)