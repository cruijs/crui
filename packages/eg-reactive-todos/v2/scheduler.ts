import { Elem, x, ElemDriver, PropDriver, AttrDriver, Driver, CreateDriver, Emitter, Emit, AnyAction, Drivers, PropType, ElemType, AttrType } from './actions/prop'

type DtoS<D> = { [K in keyof D]: InferAction<D[K]> }[keyof D]
type InferAction<FD> = FD extends Driver<infer A, any> ? A : never;

const d = {
    [PropType]: 0 as any,
    [ElemType]: 0 as any,
}
render(0 as any, d, x)

function render<N, A extends AnyAction, D extends A['_d']>(
    node: N,
    driver: D,
    action: A
): void {
    exec(node, driver, action)
}

function exec<N, A extends AnyAction, D extends Drivers>(
    node: N,
    driver: D,
    action: A
): void {
    type E = Emit<DtoS<D>>
    type Item = {
        node: any,
        action: DtoS<D>
    }

    let nextBatch: Item[] = [{ node, action: action as any }]
    const syncEmit: E = (node, action) => {
        nextBatch.push({ node, action })
    }
    const asyncEmit: E = (node, action) => {
        window.requestAnimationFrame(() => {
            exec()
        })
        syncEmit(node, action)
        emitter.emit = syncEmit
    }

    const emitter = {
        emit: syncEmit
    }
    const exec = () => {
        while (nextBatch.length !== 0) {
            const batch = nextBatch
            nextBatch = []

            batch.forEach(({ node, action }) => {
                driver[action.type](node, action, emitter)
            })
        }
        emitter.emit = asyncEmit
    }
    exec()
}