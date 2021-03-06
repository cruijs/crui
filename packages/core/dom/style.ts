export type KS = keyof Style
export type PS<K extends KS> = Pick<Style, K>
export type Style = {
    alignContent: string|null,
    alignItems: string|null,
    alignSelf: string|null,
    alignmentBaseline: string|null,
    animation: string|null,
    animationDelay: string|null,
    animationDirection: string|null,
    animationDuration: string|null,
    animationFillMode: string|null,
    animationIterationCount: string|null,
    animationName: string|null,
    animationPlayState: string|null,
    animationTimingFunction: string|null,
    backfaceVisibility: string|null,
    background: string|null,
    backgroundAttachment: string|null,
    backgroundClip: string|null,
    backgroundColor: string|null,
    backgroundImage: string|null,
    backgroundOrigin: string|null,
    backgroundPosition: string|null,
    backgroundPositionX: string|null,
    backgroundPositionY: string|null,
    backgroundRepeat: string|null,
    backgroundSize: string|null,
    baselineShift: string|null,
    border: string|null,
    borderBottom: string|null,
    borderBottomColor: string|null,
    borderBottomLeftRadius: string|null,
    borderBottomRightRadius: string|null,
    borderBottomStyle: string|null,
    borderBottomWidth: string|null,
    borderCollapse: string|null,
    borderColor: string|null,
    borderImage: string|null,
    borderImageOutset: string|null,
    borderImageRepeat: string|null,
    borderImageSlice: string|null,
    borderImageSource: string|null,
    borderImageWidth: string|null,
    borderLeft: string|null,
    borderLeftColor: string|null,
    borderLeftStyle: string|null,
    borderLeftWidth: string|null,
    borderRadius: string|null,
    borderRight: string|null,
    borderRightColor: string|null,
    borderRightStyle: string|null,
    borderRightWidth: string|null,
    borderSpacing: string|null,
    borderStyle: string|null,
    borderTop: string|null,
    borderTopColor: string|null,
    borderTopLeftRadius: string|null,
    borderTopRightRadius: string|null,
    borderTopStyle: string|null,
    borderTopWidth: string|null,
    borderWidth: string|null,
    bottom: string|null,
    boxShadow: string|null,
    boxSizing: string|null,
    breakAfter: string|null,
    breakBefore: string|null,
    breakInside: string|null,
    captionSide: string|null,
    clear: string|null,
    clip: string|null,
    clipPath: string|null,
    clipRule: string|null,
    color: string|null,
    colorInterpolationFilters: string|null,
    columnCount: any|null,
    columnFill: string|null,
    columnGap: any|null,
    columnRule: string|null,
    columnRuleColor: any|null,
    columnRuleStyle: string|null,
    columnRuleWidth: any|null,
    columnSpan: string|null,
    columnWidth: any|null,
    columns: string|null,
    content: string|null,
    counterIncrement: string|null,
    counterReset: string|null,
    cssFloat: string|null,
    cssText: string|null,
    cursor: string|null,
    direction: string|null,
    display: string|null,
    dominantBaseline: string|null,
    emptyCells: string|null,
    enableBackground: string|null,
    fill: string|null,
    fillOpacity: string|null,
    fillRule: string|null,
    filter: string|null,
    flex: string|null,
    flexBasis: string|null,
    flexDirection: string|null,
    flexFlow: string|null,
    flexGrow: string|null,
    flexShrink: string|null,
    flexWrap: string|null,
    floodColor: string|null,
    floodOpacity: string|null,
    font: string|null,
    fontFamily: string|null,
    fontFeatureSettings: string|null,
    fontSize: string|null,
    fontSizeAdjust: string|null,
    fontStretch: string|null,
    fontStyle: string|null,
    fontVariant: string|null,
    fontWeight: string|null,
    gap: string|null,
    glyphOrientationHorizontal: string|null,
    glyphOrientationVertical: string|null,
    grid: string|null,
    gridArea: string|null,
    gridAutoColumns: string|null,
    gridAutoFlow: string|null,
    gridAutoRows: string|null,
    gridColumn: string|null,
    gridColumnEnd: string|null,
    gridColumnGap: string|null,
    gridColumnStart: string|null,
    gridGap: string|null,
    gridRow: string|null,
    gridRowEnd: string|null,
    gridRowGap: string|null,
    gridRowStart: string|null,
    gridTemplate: string|null,
    gridTemplateAreas: string|null,
    gridTemplateColumns: string|null,
    gridTemplateRows: string|null,
    height: string|null,
    imeMode: string|null,
    justifyContent: string|null,
    justifyItems: string|null,
    justifySelf: string|null,
    kerning: string|null,
    layoutGrid: string|null,
    layoutGridChar: string|null,
    layoutGridLine: string|null,
    layoutGridMode: string|null,
    layoutGridType: string|null,
    left: string|null,
    letterSpacing: string|null,
    lightingColor: string|null,
    lineBreak: string|null,
    lineHeight: string|null,
    listStyle: string|null,
    listStyleImage: string|null,
    listStylePosition: string|null,
    listStyleType: string|null,
    margin: string|null,
    marginBottom: string|null,
    marginLeft: string|null,
    marginRight: string|null,
    marginTop: string|null,
    marker: string|null,
    markerEnd: string|null,
    markerMid: string|null,
    markerStart: string|null,
    mask: string|null,
    maskImage: string|null,
    maxHeight: string|null,
    maxWidth: string|null,
    minHeight: string|null,
    minWidth: string|null,
    objectFit: string|null,
    objectPosition: string|null,
    opacity: number|null,
    order: string|null,
    orphans: string|null,
    outline: string|null,
    outlineColor: string|null,
    outlineOffset: string|null,
    outlineStyle: string|null,
    outlineWidth: string|null,
    overflow: string|null,
    overflowX: string|null,
    overflowY: string|null,
    padding: string|null,
    paddingBottom: string|null,
    paddingLeft: string|null,
    paddingRight: string|null,
    paddingTop: string|null,
    pageBreakAfter: string|null,
    pageBreakBefore: string|null,
    pageBreakInside: string|null,
    penAction: string|null,
    perspective: string|null,
    perspectiveOrigin: string|null,
    pointerEvents: string|null,
    position: string|null,
    quotes: string|null,
    resize: string|null,
    right: string|null,
    rotate: string|null,
    rowGap: string|null,
    rubyAlign: string|null,
    rubyOverhang: string|null,
    rubyPosition: string|null,
    scale: string|null,
    scrollBehavior: string|null,
    stopColor: string|null,
    stopOpacity: string|null,
    stroke: string|null,
    strokeDasharray: string|null,
    strokeDashoffset: string|null,
    strokeLinecap: string|null,
    strokeLinejoin: string|null,
    strokeMiterlimit: string|null,
    strokeOpacity: number|null,
    strokeWidth: string|null,
    tableLayout: string|null,
    textAlign: string|null,
    textAlignLast: string|null,
    textAnchor: string|null,
    textCombineUpright: string|null,
    textDecoration: string|null,
    textIndent: string|null,
    textJustify: string|null,
    textKashida: string|null,
    textKashidaSpace: string|null,
    textOverflow: string|null,
    textShadow: string|null,
    textTransform: string|null,
    textUnderlinePosition: string|null,
    top: string|null,
    touchAction: string|null,
    transform: string|null,
    transformOrigin: string|null,
    transformStyle: string|null,
    transition: string|null,
    transitionDelay: string|null,
    transitionDuration: string|null,
    transitionProperty: string|null,
    transitionTimingFunction: string|null,
    translate: string|null,
    unicodeBidi: string|null,
    userSelect: string|null,
    verticalAlign: string|null,
    visibility: string|null,
    whiteSpace: string|null,
    widows: string|null,
    width: string|null,
    wordBreak: string|null,
    wordSpacing: string|null,
    wordWrap: string|null,
    writingMode: string|null,
    zIndex: string|null,
    zoom: string|null
}