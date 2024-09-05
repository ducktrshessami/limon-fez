import { Entry, getDict } from "node-cmudict";
import Cache from "./Cache";
import Fez from "./Fez";

export default class Limon {
    private static _instance: Limon;

    private _dict: Map<string, Entry> | null;
    public readonly cache: Map<string, Cache<Fez>>;

    private constructor() {
        this._dict = null;
        this.cache = new Map<string, Cache<Fez>>();
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
        return Boolean(this._dict && this.cache.size);
    }

    /**
     * Set the cmudict dictionary. Overwrites the current dictionary if it exists.
     * @param dict The dictionary to use. Defaults to getting a new cmudict dictionary.
     */
    public setDict(dict?: Map<string, Entry>): void {
        this._dict = dict ?? getDict();
    }

    private ensureCache(key: string): Cache<Fez> {
        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }
        else {
            const value = new Cache<Fez>();
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
                    const set = this.ensureCache(fez.lastSyllable);
                    if (!set.some(other => pronunciation.equals(other.pronunciation))) {
                        set.add(fez);
                    }
                }
            }
        }
    }

    public exec(word: string): string | null {
        if (!this.initialized) {
            this.init();
        }
        const formatted = word.trim().toLowerCase();
        const entry = this._dict!.get(formatted);
        if (!entry) {
            return null;
        }
        const variations = new Cache<string>();
        for (const pronunciation of entry.pronunciations) {
            const fez = new Fez(pronunciation);
            let output = "";
            let valid = true;
            for (let i = 0; i < fez.syllableCount; i++) {
                const cached = this.cache.get(fez.syllables[i]);
                if (cached) {
                    const rhymes = i === fez.syllableCount - 1 ?
                        cached.filter(other => other.lastRawSyllable === fez.lastRawSyllable) :
                        cached;
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
