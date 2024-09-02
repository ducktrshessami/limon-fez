import { Entry, getDict } from "node-cmudict";
import Singleton from "./Singleton";

export default class Limon extends Singleton {
    private _dict: Map<string, Entry> | null = null;
    public readonly cache: Map<string, Set<Entry>> = new Map();

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
