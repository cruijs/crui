function children(n) {
    const r = Array(n)
    for (let i = 0; i <= n; ++i) {
        r[i] = 'Component<C' + i + ', any>'
    }
    return r.join(', ')
}

function c(n, sep) {
    const r = Array(n)
    for (let i = 0; i <= n; ++i)
        r[i] = 'C' + i
    return r.join(sep)
}

function sig(n) {
    return 'export function hc<T extends Tag, '+ c(n, ', ') +'>(tag: T, cs: ['+ children(n) +']): Component<'+ c(n, ' & ') +', Meta<T>>'
}

for (let i = 0; i < 10; ++i) {
    console.log(sig(i))
}