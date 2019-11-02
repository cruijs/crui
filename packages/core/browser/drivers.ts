import { AppendDriver } from '../actions/append'
import { appendDriver } from '../actions/append/driver-browser'
import { AttrDriver } from '../actions/attr'
import { attrDriver } from '../actions/attr/driver-browser'
import { CreateTagDriver } from '../actions/createTag'
import { createTagDriver } from '../actions/createTag/driver-browser'
import { DestroyableDriver } from '../actions/destroyable/action'
import { CleanupDriver } from '../actions/destroyable/cleanup'
import { DestroyDriver } from '../actions/destroyable/destroy'
import { makeDestroyableDriver } from '../actions/destroyable/driver'
import { ElemDriver } from '../actions/elem'
import { makeElemDriver } from '../actions/elem/driver'
import { EmptyNodeDriver } from '../actions/emptyNode'
import { emptyNodeDriver } from '../actions/emptyNode/driver-browser'
import { EventDriver } from '../actions/event'
import { eventDriver } from '../actions/event/driver-browser'
import { GetPropDriver } from '../actions/getProp'
import { getPropDriver } from '../actions/getProp/driver-browser'
import { InsertAtDriver } from '../actions/insertAt'
import { insertAtDriver } from '../actions/insertAt/driver-browser'
import { MemoizeDriver } from '../actions/memoize'
import { makeMemoizeDriver } from '../actions/memoize/driver'
import { MountDriver, MountedDriver } from '../actions/mount'
import { makeMountDriver } from '../actions/mount/driver'
import { PropDriver } from '../actions/prop'
import { propDriver } from '../actions/prop/driver-browser'
import { RemoveDriver } from '../actions/remove'
import { removeDriver } from '../actions/remove/driver-browser'
import { ReplaceDriver } from '../actions/replace'
import { replaceDriver } from '../actions/replace/driver-browser'
import { StyleDriver } from '../actions/style'
import { styleDriver } from '../actions/style/driver-browser'
import { TemplateDriver } from '../actions/template'
import { makeTemplateDriver } from '../actions/template/driver-browser'
import { TextDriver } from '../actions/text'
import { textDriver } from '../actions/text/driver-browser'

export type CoreDrivers<N extends Node = Element> =
    AppendDriver<Node>
    & AttrDriver<N>
    & CreateTagDriver<HTMLElement>
    & DestroyableDriver<N>
    & DestroyDriver<N>
    & CleanupDriver<N>
    & ElemDriver<N>
    & EmptyNodeDriver<Comment>
    & EventDriver<N>
    & GetPropDriver<N>
    & InsertAtDriver<Node>
    & MemoizeDriver<N>
    & MountDriver<N>
    & MountedDriver<N>
    & PropDriver<N>
    & RemoveDriver<Node>
    & ReplaceDriver<Node>
    & StyleDriver<HTMLElement>
    & TemplateDriver<Node>
    & TextDriver<Node>

export const drivers: CoreDrivers = {
    ...appendDriver,
    ...attrDriver,
    ...createTagDriver,
    ...makeDestroyableDriver(),
    ...makeElemDriver(),
    ...emptyNodeDriver,
    ...eventDriver,
    ...getPropDriver,
    ...insertAtDriver,
    ...makeMemoizeDriver(),
    ...makeMountDriver(),
    ...propDriver,
    ...removeDriver,
    ...replaceDriver,
    ...styleDriver,
    ...makeTemplateDriver(),
    ...textDriver
}