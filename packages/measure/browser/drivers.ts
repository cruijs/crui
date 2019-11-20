import { CalcDimensionsDriver, calcDimensionsDriver } from '../actions/calcDimensions'
import { makeMeasureDriver, MeasureDriver } from '../actions/measure'
import { makeOnSceneResizeDriver, OnSceneResizeDriver } from '../actions/onSceneResize'

type Drivers =
    MeasureDriver<Node>
    & CalcDimensionsDriver<Element>
    & OnSceneResizeDriver<Node>

const drivers: Drivers = {
    ...makeMeasureDriver(),
    ...calcDimensionsDriver,
    ...makeOnSceneResizeDriver()
}

export default drivers