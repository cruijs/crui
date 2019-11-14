import { AnySetupAction, MatchRestr, RemoveRestr } from '../types'

export type TagR<T extends Tag = Tag> = {
    tag: T
}

export type TagMR<A extends AnySetupAction, T extends Tag = Tag> =
    MatchRestr<TagR<T>, A>

export type TagRM<A extends AnySetupAction> =
    RemoveRestr<TagR, A>

export type Tag = 'a' 
    | 'abbr' | 'address' | 'area' | 'article' | 'aside' | 'audio' | 'b'
    | 'base' | 'bdi' | 'bdo' | 'blockquote' | 'button' | 'canvas' | 'caption' | 'cite'
    | 'code' | 'col' | 'colgroup' | 'data' | 'datalist' | 'dd'
    | 'del' | 'details' | 'dfn' | 'dialog' | 'div' | 'dl' | 'dt' | 'em'
    | 'embed' | 'fieldset' | 'figcaption' | 'figure' | 'footer' | 'form'
    | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    | 'head' | 'header' | 'hgroup' | 'hr' | 'i' | 'iframe' | 'img'
    | 'input' | 'ins' | 'kbd' | 'label' | 'legend' | 'li' | 'link' | 'main'
    | 'map' | 'mark' | 'menu' | 'meta' | 'meter' | 'nav' | 'object' | 'ol'
    | 'optgroup' | 'option' | 'output' | 'p' | 'param' | 'picture' | 'pre'
    | 'progress' | 'q' | 'rb' | 'rp' | 'rt' | 'rtc' | 'ruby' | 's' | 'samp'
    | 'script' | 'section' | 'select' | 'slot' | 'small' | 'source' | 'span'
    | 'strong' | 'style' | 'sub' | 'summary' | 'sup' | 'table' | 'tbody' | 'td'
    | 'template' | 'textarea' | 'tfoot' | 'th' | 'thead' | 'time' | 'title'
    | 'tr' | 'track' | 'u' | 'ul' | 'var' | 'video' | 'wbr'