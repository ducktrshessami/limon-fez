"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  DataSet: () => DataSet,
  Fez: () => Fez,
  Limon: () => Limon
});
module.exports = __toCommonJS(src_exports);

// src/DataSet.ts
var DataSet = class _DataSet extends Set {
  some(predicate) {
    for (const value of this) {
      if (predicate(value)) {
        return true;
      }
    }
    return false;
  }
  filter(predicate) {
    const result = new _DataSet();
    for (const item of this) {
      if (predicate(item)) {
        result.add(item);
      }
    }
    return result;
  }
  random() {
    const it = this.values();
    const index = Math.floor(Math.random() * this.size);
    for (let i = 0; i < index; i++) {
      it.next();
    }
    return it.next().value ?? null;
  }
};
function ensureDataSet(map, key) {
  const set = map.get(key) ?? new DataSet();
  map.set(key, set);
  return set;
}

// src/Fez.ts
var Fez = class {
  constructor(pronunciation) {
    this.pronunciation = pronunciation;
    this.syllables = [];
    let syllable = [];
    let excess = [];
    for (const phoneme of this.pronunciation.phonemes) {
      if (phoneme.stress != null) {
        if (syllable.length) {
          excess = [];
          this.syllables.push(syllable.join(" "));
        }
        syllable = [phoneme];
      } else if (syllable[0]?.stress && syllable[0].stress < syllable.length) {
        syllable.push(phoneme);
      } else {
        excess.push(phoneme);
      }
    }
    if (syllable.length) {
      this.lastRawSyllable = syllable.concat(excess).join(" ");
      this.syllables.push(syllable.join(" "));
    } else {
      this.lastRawSyllable = this.pronunciation.phonemes.join(" ");
      this.syllables = [this.lastRawSyllable];
    }
  }
  syllables;
  lastRawSyllable;
  get syllableCount() {
    return this.syllables.length;
  }
  get lastSyllable() {
    return this.syllables[this.syllables.length - 1];
  }
};

// src/Limon.ts
var import_node_cmudict = require("node-cmudict");
var Limon = class _Limon {
  static _instance;
  _dict;
  rhymeData;
  cache;
  constructor() {
    this._dict = null;
    this.rhymeData = /* @__PURE__ */ new Map();
    this.cache = /* @__PURE__ */ new Map();
  }
  /**
   * Get the singleton instance of the class.
   */
  static getInstance() {
    if (!_Limon._instance) {
      _Limon._instance = new _Limon();
    }
    return _Limon._instance;
  }
  get dict() {
    return this._dict;
  }
  get initialized() {
    return Boolean(this._dict && this.rhymeData.size);
  }
  /**
   * Set the cmudict dictionary. Overwrites the current dictionary if it exists.
   * @param dict The dictionary to use. Defaults to getting a new cmudict dictionary.
   */
  setDict(dict) {
    this._dict = dict ?? (0, import_node_cmudict.getDict)();
  }
  /**
   * Parse the dictionary for syllables
   */
  init() {
    if (!this._dict) {
      this.setDict();
    }
    for (const entry of this._dict.values()) {
      for (const pronunciation of entry.pronunciations) {
        const fez = new Fez(pronunciation);
        if (fez.syllableCount === 1) {
          const data = ensureDataSet(this.rhymeData, fez.lastSyllable);
          if (!data.some((other) => pronunciation.equals(other.pronunciation))) {
            data.add(fez);
          }
        }
      }
    }
  }
  exec(word, force = false) {
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
    const entry = this._dict.get(formatted);
    if (!entry) {
      return null;
    }
    const variations = ensureDataSet(this.cache, formatted);
    for (const pronunciation of entry.pronunciations) {
      const fez = new Fez(pronunciation);
      let output = [];
      for (let i = 0; i < fez.syllableCount; i++) {
        const data = this.rhymeData.get(fez.syllables[i]);
        if (data) {
          const rhymes = i === fez.syllableCount - 1 ? data.filter((other) => other.lastRawSyllable === fez.lastRawSyllable) : data;
          const match = rhymes.random();
          if (match) {
            output.push(match.pronunciation.entry.name);
          } else {
            break;
          }
        } else {
          break;
        }
      }
      if (output.length === fez.syllableCount) {
        variations.add(output.join(""));
      }
    }
    return variations.random();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DataSet,
  Fez,
  Limon
});
//# sourceMappingURL=index.js.map