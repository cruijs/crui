import { attr } from './attr';
import { h } from './elem';
import { on } from './event';
import { prop } from './prop/index';
import { text } from './text';

export const x = h('div', [
    prop('className', 'test'),
    attr('tabIndex', '-1'),
    text(''),
    h('form', [
        on('submit', (e) => e.preventDefault()),
    ])
])