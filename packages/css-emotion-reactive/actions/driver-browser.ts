import { Cleanup, cleanup } from '@crui/core';
import { CssDriver, CssType } from '@crui/css-emotion';
import { apply } from '@crui/reactive/rx/box/apply';
import { ClassNamesArg, css, cx } from 'emotion';
import { $CssDriver, $CssType } from './css';
import { DynCssDriver, DynCssType } from './dynCss';

type Drivers = 
    CssDriver<Element> 
    & $CssDriver<Element, Cleanup>
    & DynCssDriver<Element, Cleanup>

type Classes = WeakMap<Element, ClassNamesArg[]>

export function make$CssDriver(): Drivers {
    const classes: Classes = new WeakMap()
    const addStyle = (node: Element, klass: ClassNamesArg) => {
        let s = classes.get(node)
        if (s === undefined) {
            s = [klass]
            classes.set(node, s)
        }
        else {
            s.push(klass)
        }
        return s
    }
    const replaceStyle = (
        node: Element,
        prev: ClassNamesArg | undefined,
        klass: ClassNamesArg
    ) => {
        const s = classes.get(node)
        if (s === undefined || prev === undefined)
            return addStyle(node, klass)

        s[s.indexOf(prev)] = klass
        return s
    }

    return {
        [CssType]: (node, { style }) => {
            const s = addStyle(node, css(style))
            node.className = cx(...s)
        },
        [DynCssType]: (node, { stream }, { emit }) => {
            let prev: ClassNamesArg|undefined

            apply(stream, (style) => {
                const k = css(style)
                const s = replaceStyle(node, prev, k)

                prev = k
                node.className = cx(...s)
            })

            emit(node, cleanup(stream.destroy))
        },
        [$CssType]: (node, { when, style }, { emit }) => {
            const k = css(style)
            const klass = { [k]: false }
            addStyle(node, klass)

            apply(when, (isActive) => {
                klass[k] = isActive
                node.className = cx(...classes.get(node)!)
            })

            emit(node, cleanup(when.destroy))
        }
    }
}