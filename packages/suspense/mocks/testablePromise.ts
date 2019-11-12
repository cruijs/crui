export type TestablePromise<T> = {
    promise: Promise<T>
    resolve: (val: T) => void
    reject: (err: Error) => void
}

export const testablePromise = <T>() => {
    const defer = {} as TestablePromise<T>
    defer.promise = new Promise((resolve, reject) => {
        defer.resolve = resolve
        defer.reject = reject
    })
    return defer
}