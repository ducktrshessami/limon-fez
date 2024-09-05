import { Phoneme, Pronunciation } from "node-cmudict";

export default class Fez {
    public readonly syllables: string[];
    public readonly lastRawSyllable: string;

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
            else if (syllable[0]?.stress && syllable[0].stress < syllable.length) {
                syllable.push(phoneme);
            }
            else {
                excess.push(phoneme);
            }
        }
        if (syllable.length) {
            this.lastRawSyllable = syllable.concat(excess).join(" ");
            this.syllables.push(syllable.join(" "));
        }
        else { // Some donkus decided to create a pronunciation with no stressed phonemes
            this.lastRawSyllable = this.pronunciation.phonemes.join(" ");
            this.syllables = [this.lastRawSyllable];
        }
    }

    public get syllableCount(): number {
        return this.syllables.length;
    }

    public get lastSyllable(): string {
        return this.syllables[this.syllables.length - 1];
    }
}
