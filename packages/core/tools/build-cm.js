function setup(n) {
    const r = Array(n+1)
    for (let i = 0; i <= n; ++i) {
        r[i] = 'Setup<C, M' + i + ', M' + (i+1) + '>'
    }
    return r.join(', ')
}

function t(l, n) {
    n += 1
    const r = Array(n+1)
    for (let i = 0; i <= n; ++i)
        r[i] = l + i
    return r.join(', ')
}

function c(n) {
    const r = Array(n+1)
    for (let i = 0; i <= n; ++i)
        r[i] = 'C' + i
    return r.join(' & ')
}

function sig(n) {
    return 'export function cm<C' + ', ' + t('M', n) + '>(comp: Component<C, M0>, setups: [' + setup(n) + ']): Component<C' + ', M' + (n + 1) + '>'
}

for (let i = 0; i < 10; ++i) {
    console.log(sig(i))
}