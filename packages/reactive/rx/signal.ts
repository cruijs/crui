import { Unsubscribe } from '@crui/core/types';
import { remove } from '@crui/core/utils/array';
import { Fn0, runAll } from '@crui/core/utils/combine';

export class Signal {
    private listeners: Fn0[] = []

    subscribe(eff: Fn0): Unsubscribe {
        this.listeners.push(eff)
        return () => {
            remove(this.listeners, eff)
        }
    }

    trigger() {
        runAll(this.listeners.slice())
    }
}