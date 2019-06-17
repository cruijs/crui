import { DOM, Node, Tag } from '@crui/core/dom';
import { noop } from '@crui/core/utils/noop';
import { tx } from '@crui/transitions';
import { Animation } from 'gsap';

type MakeAnimation = <N extends Node<Tag>>(node: N, dom: DOM<N>) => Animation
export const anim = (make: MakeAnimation) => 
    tx((node, dom) => {
        const tween = make(node, dom).pause()

        let done = noop
        const cancel = () => {
            done()
            done = noop
        }
        return {
            intro: {
                cancel,
                run: () => {
                    return new Promise((resolve) => {
                        done = resolve
                        tween.play().eventCallback('onComplete', resolve)
                    })
                },
            },
            outro: {
                cancel,
                run: () => {
                    return new Promise((resolve) => {
                        done = resolve
                        tween.reverse().eventCallback('onReverseComplete', resolve)
                    })
                }
            }
        }
    })