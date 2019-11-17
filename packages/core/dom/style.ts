export type DomStyle = Pick<
    CSSStyleDeclaration,
    Exclude<keyof CSSStyleDeclaration, 'length'|'parentRule'>
>
export type StyleK = keyof DomStyle
export type StyleP<K extends StyleK> = DomStyle[K]