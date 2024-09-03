import { Phoneme, Pronunciation } from "node-cmudict";

export default class Fez {
    public readonly syllables: string[];

    constructor(public readonly pronunciation: Pronunciation) {
        this.syllables = [];
        let syllable: Phoneme[] = [];
        for (const phoneme of this.pronunciation.phonemes) {
            if (phoneme.stress != null) {
                if (syllable.length) {
                    this.syllables.push(syllable.join(" "));
                }
                syllable = [phoneme];
            }
            else if (syllable[0]?.stress && syllable[0].stress <= syllable.length) {
                syllable.push(phoneme);
            }
        }
        if (syllable.length) {
            this.syllables.push(syllable.join(" "));
        }
    }

    public get lastSyllable(): string {
        return this.syllables[this.syllables.length - 1];
    }
}
