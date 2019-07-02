function setup(n) {
    const r = Array(n+1)
    for (let i = 0; i <= n; ++i) {
        r[i] = 'Setup<C' + i + ', M>'
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

function tc(n) {
    return t('C', n)
}

function c(n) {
    const r = Array(n+1)
    for (let i = 0; i <= n; ++i)
        r[i] = 'C' + i
    return r.join(' & ')
}

function sig(n) {
    return 'export function sc<'+ tc(n) + ', M>(setups: [' + setup(n) + ']): Setup<' + c(n) + ', M>'
}

for (let i = 0; i < 10; ++i) {
    console.log(sig(i))
}