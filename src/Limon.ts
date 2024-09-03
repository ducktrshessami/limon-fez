import { Entry, getDict } from "node-cmudict";
import Fez from "./Fez";
import { setSome } from "./util";

export default class Limon {
    private static _instance: Limon;

    private _dict: Map<string, Entry> | null;
    public readonly cache: Map<string, Set<Fez>>;

    private constructor() {
        this._dict = null;
        this.cache = new Map<string, Set<Fez>>();
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

    private ensureCache(key: string): Set<Fez> {
        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }
        else {
            const value = new Set<Fez>();
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
                const set = this.ensureCache(fez.lastSyllable);
                if (!setSome(set, other => other.pronunciation == pronunciation)) {
                    set.add(fez);
                }
            }
        }
    }
}
