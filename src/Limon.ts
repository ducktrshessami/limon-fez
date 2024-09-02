import { Entry, getDict } from "node-cmudict";

export default class Limon {
    private static _instance: Limon;

    private _dict: Map<string, Entry> | null;
    public readonly cache: Map<string, Set<Entry>>;

    private constructor() {
        this._dict = null;
        this.cache = new Map<string, Set<Entry>>();
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

    /**
     * Initialize the instance with a cmudict dictionary. Overwrites the current dictionary if it exists.
     * @param dict The dictionary to use. Defaults to getting a new cmudict dictionary.
     */
    public init(dict?: Map<string, Entry>): void {
        this._dict = dict ?? getDict();
    }
}
