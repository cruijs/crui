import { AbstractStreamList } from './abstract-stream';

export class StreamList<T> extends AbstractStreamList<T> {
    protected updated = this.notify.bind(this)
}