import { Phoneme, Pronunciation } from "node-cmudict";

export default class Fez {
    public readonly syllables: string[];

    constructor(public readonly pronunciation: Pronunciation) {
        this.syllables = [];
        let syllable: Phoneme[] = [];
        let excess: Phoneme[] = [];
        for (const phoneme of this.pronunciation.phonemes) {
            if (phoneme.stress != null) {
                if (syllable.length) {
                    excess = [];
                    this.syllables.push(syllable.join(" "));
                }
                syllable = [phoneme];
            }
            else if (syllable[0]?.stress && syllable[0].stress <= syllable.length) {
                syllable.push(phoneme);
            }
            else {
                excess.push(phoneme);
            }
        }
        if (syllable.length) {
            this.syllables.push(syllable.concat(excess).join(" "));
        }
    }

    public get lastSyllable(): string {
        return this.syllables[this.syllables.length - 1];
    }

    public *reverseSyllables(): Generator<string> {
        for (let i = this.syllables.length - 1; i >= 0; i--) {
            yield this.syllables[i];
        }
    }
}
