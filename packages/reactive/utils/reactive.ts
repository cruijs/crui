import { DR$B } from '../rx/box/types';

export type Reactive<P extends {}> = {[K in keyof P]: DR$B<P[K]>}