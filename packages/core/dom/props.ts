export type KProps = keyof Props
export type PProps<K extends KProps> = Pick<Props, K>
export type Props = {
    className: string,

    // input
    type: string,
    name: string,
    value: string,
    checked: boolean,
    multiple: string,
    placeholder: string,
    step: string,

    // textarea
    cols: string,
    rows: string,
    selectionStart: number,
    selectionEnd: number,
    selectionDirection: string,
    wrap: string,

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
    disabled: string,

    // label
    htmlFor: string,

    // form
    action: string,
    method: string,
    autocomplete: string,
    noValidate: string,
}