import { Phoneme, Pronunciation } from "node-cmudict";

export default class Fez {
    public readonly syllables: Phoneme[][];
    public readonly lastRawSyllable: Phoneme[];

    constructor(public readonly pronunciation: Pronunciation) {
        this.syllables = [];
        let syllable: Phoneme[] = [];
        let excess: Phoneme[] = [];
        for (const phoneme of this.pronunciation.phonemes) {
            if (phoneme.stress != null) {
                if (syllable.length) {
                    this.syllables.push(syllable);
                }
                syllable = [phoneme];
                excess = [];
            }
            else if (syllable[0]?.stress && syllable.length <= syllable[0].stress) {
                syllable.push(phoneme);
            }
            else {
                excess.push(phoneme);
            }
        }
        if (syllable.length) {
            this.lastRawSyllable = syllable.concat(excess);
            this.syllables.push(syllable);
        }
        else { // Some donkus decided to create a pronunciation with no stressed phonemes
            this.lastRawSyllable = this.pronunciation.phonemes;
            this.syllables = [this.lastRawSyllable];
        }
    }

    public get syllableCount(): number {
        return this.syllables.length;
    }
}
