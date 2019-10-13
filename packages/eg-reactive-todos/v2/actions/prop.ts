import { child, h } from './elem'
import { prop } from './prop/index'
import { attr } from './attr'

export const x = h('div', [
    prop('className', 'test'),
    prop('tabIndex', -1),
    child('span', [
        prop('className', 'child'),
        attr('test', 'er'),
    ])
])