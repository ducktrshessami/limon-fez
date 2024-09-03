export function setSome<T>(set: Set<T>, predicate: (value: T) => boolean): boolean {
    for (const value of set) {
        if (predicate(value)) {
            return true;
        }
    }
    return false;
}
