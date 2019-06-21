function setup(n) {
    const r = Array(n+1)
    r[0] = 'Setup<C0, Meta<T>, M0>'
    for (let i = 0; i < n; ++i) {
        const j = i + 1
        r[j] = 'Setup<C' + j + ', M' + i + ', M' + j + '>'
    }
    return r.join(', ')
}

function t(l, n) {
    const r = Array(n)
    for (let i = 0; i <= n; ++i)
        r[i] = l + i
    return r.join(', ')
}

function c(n) {
    const r = Array(n)
    for (let i = 0; i <= n; ++i)
        r[i] = 'C' + i
    return r.join(' & ')
}

function sig(n) {
    return 'export function h<T extends Tag, '+ t('C', n) + ', ' + t('M', n) + '>(tag: T, setups: [' + setup(n) + ']): Component<' + c(n) + ', M' + n + '>'
}

for (let i = 0; i < 10; ++i) {
    console.log(sig(i))
}