export function ensure<Key, Value>(
    map: Map<Key, Value>,
    key: Key,
    value: Value
): Value {
    if (map.has(key)) {
        return map.get(key)!;
    }
    else {
        map.set(key, value);
        return value;
    }
}
