import { AttrDriver, EventDriver, InsertAtDriver, PropDriver, RemoveDriver } from '../actions'
import { appendDriver } from '../actions/append/driver-mock'
import { AppendDriver } from '../actions/append/index'
import { attrDriver } from '../actions/attr/driver-mock'
import { createTagDriver } from '../actions/createTag/driver-mock'
import { CreateTagDriver } from '../actions/createTag/index'
import { DestroyableDriver } from '../actions/destroyable/action'
import { CleanupDriver } from '../actions/destroyable/cleanup'
import { DestroyDriver } from '../actions/destroyable/destroy'
import { makeDestroyableDriver } from '../actions/destroyable/driver'
import { emptyNodeDriver } from '../actions/emptyNode/driver-mock'
import { EmptyNodeDriver } from '../actions/emptyNode/index'
import { eventDriver } from '../actions/event/driver-mock'
import { FragmentDriver, fragmentDriverMock } from '../actions/fragment'
import { getPropDriver } from '../actions/getProp/driver-mock'
import { GetPropDriver } from '../actions/getProp/index'
import { insertAtDriver } from '../actions/insertAt/driver-mock'
import { makeMountDriver, MountDriver } from '../actions/mount'
import { propDriver } from '../actions/prop/driver-mock'
import { removeDriver } from '../actions/remove/driver-mock'
import { replaceDriver } from '../actions/replace/driver-mock'
import { ReplaceDriver } from '../actions/replace/index'
import { styleDriver } from '../actions/style/driver-mock'
import { StyleDriver } from '../actions/style/index'
import { textDriver } from '../actions/text/driver-mock'
import { TextDriver } from '../actions/text/index'
import { MockFragment } from './mockFragment'
import { MockNode } from './mockNode'

type Drivers<N = MockNode> =
    AppendDriver<N>
    & AttrDriver<N>
    & CreateTagDriver<N>
    & DestroyDriver<N>
    & DestroyableDriver<N>
    & CleanupDriver<N>
    & EmptyNodeDriver<N>
    & EventDriver<N>
    & InsertAtDriver<N>
    & PropDriver<N>
    & GetPropDriver<N>
    & RemoveDriver<N>
    & ReplaceDriver<N>
    & StyleDriver<N>
    & TextDriver<N>
    & MountDriver<N>
    & FragmentDriver<MockNode, MockFragment>

export const mockDrivers: Drivers = {
    ...appendDriver,
    ...attrDriver,
    ...createTagDriver,
    ...makeDestroyableDriver<MockNode>(),
    ...emptyNodeDriver,
    ...eventDriver,
    ...insertAtDriver,
    ...propDriver,
    ...getPropDriver,
    ...removeDriver,
    ...replaceDriver,
    ...styleDriver,
    ...textDriver,
    ...makeMountDriver(),
    ...fragmentDriverMock,
}