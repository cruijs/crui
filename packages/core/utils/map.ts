type MapLike<K, V> = {
    get(key: K): V|undefined
    set(key: K, value: V): void
}

export function mapPush<K, V>(map: MapLike<K, V[]>, key: K, value: V): void {
    const list = map.get(key)
    if (list == null)
        map.set(key, [value])
    else
        list.push(value)
}

export function mapConcat<K, V>(map: MapLike<K, V[]>, key: K, values: V[]): void {
    const list = map.get(key)
    if (list == null)
        map.set(key, values)
    else
        list.push(...values)
}