import { Pronunciation, Entry } from 'node-cmudict';

declare class DataSet<T> extends Set<T> {
    some(predicate: (value: T, set: this) => unknown): boolean;
    some<This>(predicate: (this: This, value: T, set: this) => unknown, thisArg: This): boolean;
    filter(predicate: (value: T, set: this) => unknown): DataSet<T>;
    filter<This>(predicate: (this: This, value: T, set: this) => unknown, thisArg: This): DataSet<T>;
    filter<This, Type extends T>(predicate: (this: This, value: T, set: this) => value is Type, thisArg: This): DataSet<Type>;
    filter<Type extends T>(predicate: (value: T, set: this) => value is Type): DataSet<Type>;
    random(): T | null;
}

declare class Fez {
    readonly pronunciation: Pronunciation;
    readonly syllables: string[];
    readonly lastRawSyllable: string;
    private static formatSyllable;
    constructor(pronunciation: Pronunciation);
    get syllableCount(): number;
    get lastSyllable(): string;
}

declare class Limon {
    private static _instance;
    private _dict;
    readonly rhymeData: Map<string, DataSet<Fez>>;
    private constructor();
    /**
     * Get the singleton instance of the class.
     */
    static getInstance(): Limon;
    get dict(): Map<string, Entry> | null;
    get initialized(): boolean;
    /**
     * Set the cmudict dictionary. Overwrites the current dictionary if it exists.
     * @param dict The dictionary to use. Defaults to getting a new cmudict dictionary.
     */
    setDict(dict?: Map<string, Entry>): void;
    /**
     * Parse the dictionary for syllables
     */
    init(): void;
    /**
     * Limon fez!
     * @param word The word to nonsensify
     */
    exec(word: string): string | null;
}

export { DataSet, Fez, Limon };
