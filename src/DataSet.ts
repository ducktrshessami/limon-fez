export default class DataSet<T> extends Set<T> {
    some(predicate: (value: T, set: this) => unknown): boolean;
    some<This>(predicate: (this: This, value: T, set: this) => unknown, thisArg: This): boolean;
    some(predicate: (value: T, set: this) => unknown, thisArg?: unknown): boolean {
        const fn = thisArg === undefined ? predicate : predicate.bind(thisArg);
        for (const value of this) {
            if (fn(value, this)) {
                return true;
            }
        }
        return false;
    }

    filter(predicate: (value: T, set: this) => unknown): DataSet<T>;
    filter<This>(predicate: (this: This, value: T, set: this) => unknown, thisArg: This): DataSet<T>;
    filter<This, Type extends T>(predicate: (this: This, value: T, set: this) => value is Type, thisArg: This): DataSet<Type>;
    filter<Type extends T>(predicate: (value: T, set: this) => value is Type): DataSet<Type>;
    filter(predicate: (value: T, set: this) => unknown, thisArg?: unknown): DataSet<T> {
        const fn = thisArg === undefined ? predicate : predicate.bind(thisArg);
        const result = new DataSet<T>();
        for (const item of this) {
            if (fn(item, this)) {
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

    concat(...sets: DataSet<T>[]): DataSet<T> {
        const result = new DataSet<T>(this);
        for (const set of sets) {
            for (const item of set) {
                result.add(item);
            }
        }
        return result;
    }
}

export function ensureDataSet<K, T>(map: Map<K, DataSet<T>>, key: K): DataSet<T> {
    const set = map.get(key) ?? new DataSet<T>();
    map.set(key, set);
    return set;
}
