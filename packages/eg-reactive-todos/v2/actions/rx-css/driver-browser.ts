import { apply } from '@crui/reactive/rx/box/apply';
import { $CssDriver, $CssType } from './index';
import { Cleanup, cleanup } from '../cleanup';
import { css } from 'emotion';

export const $cssDriver: $CssDriver<Element, Cleanup> = {
    [$CssType]: (node, { when, style }, { emit }) => {
        const klass = css(style)
        apply(when, (shouldAdd) => {
            if (shouldAdd)
                node.classList.add(klass)
            else
                node.classList.remove(klass)
        })

        emit(node, cleanup(when.destroy))
        return node
    }
}