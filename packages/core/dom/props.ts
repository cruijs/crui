export type KProps = keyof Props
export type PProps<K extends KProps> = Pick<Props, K>
export type Props = {
    id: string,
    className: string,

    // input
    type: string,
    name: string,
    value: string,
    checked: boolean,
    multiple: boolean,
    placeholder: string,
    step: number,

    // textarea
    cols: number,
    rows: number,
    selectionStart: number,
    selectionEnd: number,
    selectionDirection: string,
    wrap: string,
    spellcheck: boolean

    // img
    src: string,
    alt: string,
    height: string,
    width: string,

    // anchor
    href: string,
    rel: string,
    target: string,

    // button
    disabled: boolean,

    // label
    htmlFor: string,

    // form
    action: string,
    method: string,
    autocomplete: boolean,
    noValidate: boolean,
}