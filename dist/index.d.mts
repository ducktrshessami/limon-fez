import { Pronunciation, Entry } from 'node-cmudict';

declare class DataSet<T> extends Set<T> {
    some(predicate: (value: T) => unknown): boolean;
    filter(predicate: (value: T) => unknown): DataSet<T>;
    random(): T | null;
}

declare class Fez {
    readonly pronunciation: Pronunciation;
    readonly syllables: string[];
    readonly lastRawSyllable: string;
    constructor(pronunciation: Pronunciation);
    get syllableCount(): number;
    get lastSyllable(): string;
}

declare class Limon {
    private static _instance;
    private _dict;
    readonly rhymeData: Map<string, DataSet<Fez>>;
    readonly cache: Map<string, DataSet<string>>;
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
    exec(word: string, force?: boolean): string | null;
}

export { DataSet, Fez, Limon };
