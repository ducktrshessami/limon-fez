import { Entry, getDict } from "node-cmudict";

function ensureEntry(dict: Map<string, Entry>, name: string): Entry {
    const entry = dict.get(name);
    if (!entry) {
        throw new Error(`No entry for '${name}' in dictionary`);
    }
    return entry;
}

describe("SyllableTree", function () {
    let testEntry: Entry;
    let nestEntry: Entry;

    before(function () {
        const dict = getDict();
        testEntry = ensureEntry(dict, "testing");
        nestEntry = ensureEntry(dict, "nesting");
    });
});
