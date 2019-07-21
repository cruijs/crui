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
    return 'export function children<'+ c(n, ', ') +', M>(cs: [' + children(n) + ']): Setup<'+ c(n, ' & ') +', M>'
}

for (let i = 0; i < 10; ++i) {
    console.log(sig(i))
}
console.log('export function children<C, M>(cs: Component<C, any>[]): Setup<C, M>')