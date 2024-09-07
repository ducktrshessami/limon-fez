export function mapEvery<K, V>(map: Map<K, V>, predicate: (value: V, key: K, map: Map<K, V>) => unknown): boolean;
export function mapEvery<K, V, This>(map: Map<K, V>, predicate: (this: This, value: V, key: K, map: Map<K, V>) => unknown, thisArg: This): boolean;
export function mapEvery<K, V, This, T extends V>(map: Map<K, V>, predicate: (this: This, value: V, key: K, map: Map<K, V>) => value is T, thisArg: This): map is Map<K, T>;
export function mapEvery<K, V, T extends V>(map: Map<K, V>, predicate: (value: V, key: K, map: Map<K, V>) => value is T): map is Map<K, T>;
export function mapEvery<K, V>(map: Map<K, V>, predicate: (value: V, key: K, map: Map<K, V>) => unknown, thisArg?: unknown): boolean {
    const fn = thisArg === undefined ? predicate : predicate.bind(thisArg);
    for (const [key, value] of map) {
        if (!fn(value, key, map)) {
            return false;
        }
    }
    return true;
}
