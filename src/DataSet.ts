export default class DataSet<T> extends Set<T> {
    some(predicate: (value: T) => unknown): boolean {
        for (const value of this) {
            if (predicate(value)) {
                return true;
            }
        }
        return false;
    }

    filter(predicate: (value: T) => unknown): DataSet<T> {
        const result = new DataSet<T>();
        for (const item of this) {
            if (predicate(item)) {
                result.add(item);
            }
        }
        return result;
    }

    random(): T | null {
        const it = this.values();
        const index = Math.floor(Math.random() * this.size);
        for (let i = 0; i < index; i++) {
            it.next();
        }
        return it.next().value ?? null;
    }
}

export function ensureDataSet<K, T>(map: Map<K, DataSet<T>>, key: K): DataSet<T> {
    const set = map.get(key) ?? new DataSet<T>();
    map.set(key, set);
    return set;
}
