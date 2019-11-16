export class Suspender {
    private promises: PromiseLike<any>[]

    constructor() {
        this.promises = []
    }

    waitFor = (p: PromiseLike<any>) => {
        this.promises.push(p)
    }

    waitAll(): PromiseLike<void> {
        const promises = this.promises
        this.promises = []
        return Promise.all(promises).then(() => {
            if (this.promises.length !== 0) {
                return this.waitAll()
            }
            return
        })
    }

    nothingToWaitFor() {
        return this.promises.length === 0
    }
}