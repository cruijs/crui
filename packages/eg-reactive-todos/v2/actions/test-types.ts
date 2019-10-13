import { attr } from './attr';
import { h } from './elem';
import { on } from './event';
import { prop } from './prop';

export const x = h('div', [
    prop('className', 'test'),
    attr('tabIndex', '-1'),
    h('form', [
        on('submit', () => {})
    ])
])