function setup(n) {
    const r = Array(n)
    for (let i = 0; i <= n; ++i) {
        r[i] = 'Setup<C' + i + ', Meta<T>>'
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
    return 'export function h<T extends Tag, '+ t('C', n) + '>(tag: T, setups: [' + setup(n) + ']): Component<' + c(n) + ', Meta<T>>'
}

for (let i = 0; i < 10; ++i) {
    console.log(sig(i))
}