import { Entry, getDict } from "node-cmudict";
import DataSet from "./DataSet";
import Fez from "./Fez";
import { SyllableTreeRoot } from "./SyllableTree";

export default class Limon {
    private static _instance: Limon;

    private _dict: Map<string, Entry> | null;
    public readonly rhymeTree: SyllableTreeRoot;

    private constructor() {
        this._dict = null;
        this.rhymeTree = new SyllableTreeRoot();
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
        return Boolean(this._dict && !this.rhymeTree.empty);
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
                this.rhymeTree.add(fez);
            }
        }
    }

    /**
     * Limon fez!
     * @param word The word to nonsensify
     */
    public exec(word: string): string | null {
        if (!this.initialized) {
            this.init();
        }
        const formatted = word.trim().toLowerCase();
        const entry = this._dict!.get(formatted);
        if (!entry) {
            return null;
        }
        const variations = new DataSet<string>();
        for (const pronunciation of entry.pronunciations) {
            const fez = new Fez(pronunciation);
            let output: string[] = [];
            for (let i = 0; i < fez.syllableCount; i++) {
                const match = this.rhymeTree
                    .get(fez.syllables[i])
                    .random();
                if (match) {
                    output.push(match.pronunciation.entry.name);
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
