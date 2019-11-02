import { BindCheckedDriver, BindValueDriver } from '../actions/bind'
import { bindCheckedDriver, bindValueDriver } from '../actions/bind/driver'
import { $ChildDriver } from '../actions/child'
import { make$ChildDriver } from '../actions/child/driver'
import { $ChildrenDriver } from '../actions/children'
import { make$ChildrenDriver } from '../actions/children/driver'
import { FocusDriver } from '../actions/focus'
import { focusDriver } from '../actions/focus/driver-browser'
import { IfThenElseDriver } from '../actions/ifThenElse'
import { makeIfThenElseDriver } from '../actions/ifThenElse/driver'
import { ListViewDriver } from '../actions/listView'
import { makeListViewDriver } from '../actions/listView/driver'
import { $PropDriver } from '../actions/prop'
import { makePropDriver } from '../actions/prop/driver'
import { SetNodeValueDriver } from '../actions/setNodeValue'
import { setNodeValueDriver } from '../actions/setNodeValue/driver-browser'
import { $TextDriver } from '../actions/text'
import { make$TextDriver } from '../actions/text/driver'

type ReactiveDrivers<N = Node> =
    BindCheckedDriver<N>
    & BindValueDriver<N>
    & $ChildDriver<N>
    & $ChildrenDriver<N>
    & FocusDriver<N>
    & IfThenElseDriver<N>
    & ListViewDriver<N>
    & $PropDriver<N>
    & SetNodeValueDriver<N>
    & $TextDriver<N>

export const drivers: ReactiveDrivers = {
    ...bindCheckedDriver,
    ...bindValueDriver,
    ...make$ChildDriver(),
    ...make$ChildrenDriver(),
    ...focusDriver,
    ...makeIfThenElseDriver(),
    ...makeListViewDriver(),
    ...makePropDriver(),
    ...setNodeValueDriver,
    ...make$TextDriver(),
}