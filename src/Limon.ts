import { Entry, getDict } from "node-cmudict";
import DataSet from "./DataSet";
import Fez from "./Fez";

export default class Limon {
    private static _instance: Limon;

    private _dict: Map<string, Entry> | null;
    public readonly rhymeData: Map<string, DataSet<Fez>>;
    public readonly cache: Map<string, DataSet<string>>;

    private constructor() {
        this._dict = null;
        this.rhymeData = new Map<string, DataSet<Fez>>();
        this.cache = new Map<string, DataSet<string>>();
    }

    /**
     * Get the singleton instance of the class.
     */
    public static getInstance(): Limon {
        if (!Limon._instance) {
            Limon._instance = new Limon();
        }
        return Limon._instance;
    }

    public get dict() {
        return this._dict;
    }

    public get initialized(): boolean {
        return Boolean(this._dict && this.rhymeData.size);
    }

    /**
     * Set the cmudict dictionary. Overwrites the current dictionary if it exists.
     * @param dict The dictionary to use. Defaults to getting a new cmudict dictionary.
     */
    public setDict(dict?: Map<string, Entry>): void {
        this._dict = dict ?? getDict();
    }

    private ensureRhymeData(key: string): DataSet<Fez> {
        if (this.rhymeData.has(key)) {
            return this.rhymeData.get(key)!;
        }
        else {
            const value = new DataSet<Fez>();
            this.rhymeData.set(key, value);
            return value;
        }
    }

    private ensureCache(key: string): DataSet<string> {
        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }
        else {
            const value = new DataSet<string>();
            this.cache.set(key, value);
            return value;
        }
    }

    /**
     * Parse the dictionary for syllables
     */
    public init(): void {
        if (!this._dict) {
            this.setDict();
        }
        for (const entry of this._dict!.values()) {
            for (const pronunciation of entry.pronunciations) {
                const fez = new Fez(pronunciation);
                if (fez.syllableCount === 1) {
                    const set = this.ensureRhymeData(fez.lastSyllable);
                    if (!set.some(other => pronunciation.equals(other.pronunciation))) {
                        set.add(fez);
                    }
                }
            }
        }
    }

    public exec(word: string, force: boolean = false): string | null {
        if (!this.initialized) {
            this.init();
        }
        const formatted = word.trim().toLowerCase();
        if (!force) {
            const cached = this.cache.get(formatted);
            if (cached) {
                return cached.random();
            }
        }
        const entry = this._dict!.get(formatted);
        if (!entry) {
            return null;
        }
        const variations = this.ensureCache(formatted);
        for (const pronunciation of entry.pronunciations) {
            const fez = new Fez(pronunciation);
            let output = "";
            let valid = true;
            for (let i = 0; i < fez.syllableCount; i++) {
                const data = this.rhymeData.get(fez.syllables[i]);
                if (data) {
                    const rhymes = i === fez.syllableCount - 1 ?
                        data.filter(other => other.lastRawSyllable === fez.lastRawSyllable) :
                        data;
                    const match = rhymes.random();
                    if (match) {
                        output += match.pronunciation.entry.name;
                    }
                    else {
                        valid = false;
                    }
                }
                else {
                    valid = false;
                }
            }
            if (valid) {
                variations.add(output);
            }
        }
        return variations.random();
    }
}
