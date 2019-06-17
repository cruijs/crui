export type AnyTag = string
export type Node<T extends AnyTag> = { nodeName: T }
export type AnyNode = Node<AnyTag>
export type Unsubscribe = () => void
export type AsyncFn = () => PromiseLike<void>

export type Tag = 'a' 
    | 'abbr' | 'address' | 'area' | 'article' | 'aside' | 'audio' | 'b'
    | 'base' | 'bdi' | 'bdo' | 'blockquote' | 'button' | 'canvas' | 'caption' | 'cite'
    | 'code' | 'col' | 'colgroup' | 'data' | 'datalist' | 'dd'
    | 'del' | 'details' | 'dfn' | 'dialog' | 'div' | 'dl' | 'dt' | 'em'
    | 'embed' | 'fieldset' | 'figcaption' | 'figure' | 'footer' | 'form' | 'h1'
    | 'head' | 'header' | 'hgroup' | 'hr' | 'i' | 'iframe' | 'img'
    | 'input' | 'ins' | 'kbd' | 'label' | 'legend' | 'li' | 'link' | 'main'
    | 'map' | 'mark' | 'menu' | 'meta' | 'meter' | 'nav' | 'object' | 'ol'
    | 'optgroup' | 'option' | 'output' | 'p' | 'param' | 'picture' | 'pre'
    | 'progress' | 'q' | 'rb' | 'rp' | 'rt' | 'rtc' | 'ruby' | 's' | 'samp'
    | 'script' | 'section' | 'select' | 'slot' | 'small' | 'source' | 'span'
    | 'strong' | 'style' | 'sub' | 'summary' | 'sup' | 'table' | 'tbody' | 'td'
    | 'template' | 'textarea' | 'tfoot' | 'th' | 'thead' | 'time' | 'title'
    | 'tr' | 'track' | 'u' | 'ul' | 'var' | 'video' | 'wbr'