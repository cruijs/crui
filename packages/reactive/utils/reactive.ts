import { StreamBox } from '../rx/box';

export type Reactive<P extends {}> = {[K in keyof P]: StreamBox<P[K]>}