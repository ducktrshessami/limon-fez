import { Entry, getDict } from "node-cmudict";
import DataSet, { ensureDataSet } from "./DataSet";
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
                    const data = ensureDataSet(this.rhymeData, fez.lastSyllable);
                    if (!data.some(other => pronunciation.equals(other.pronunciation))) {
                        data.add(fez);
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
        const variations = ensureDataSet(this.cache, formatted);
        for (const pronunciation of entry.pronunciations) {
            const fez = new Fez(pronunciation);
            let output: string[] = [];
            for (let i = 0; i < fez.syllableCount; i++) {
                const data = this.rhymeData.get(fez.syllables[i]);
                if (data) {
                    const rhymes = i === fez.syllableCount - 1 ?
                        data.filter(other => other.lastRawSyllable === fez.lastRawSyllable) :
                        data;
                    const match = rhymes.random();
                    if (match) {
                        output.push(match.pronunciation.entry.name);
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            if (output.length === fez.syllableCount) {
                variations.add(output.join(""));
            }
        }
        return variations.random();
    }
}
