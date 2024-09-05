import { Phoneme, Pronunciation } from "node-cmudict";

export default class Fez {
    public readonly syllables: string[];
    public readonly lastRawSyllable: string;

    private static formatSyllable(syllable: Phoneme[]): string {
        return syllable.map(phoneme => phoneme.phoneme).join(" ");
    }

    constructor(public readonly pronunciation: Pronunciation) {
        this.syllables = [];
        let syllable: Phoneme[] = [];
        let excess: Phoneme[] = [];
        for (const phoneme of this.pronunciation.phonemes) {
            if (phoneme.stress != null) {
                if (syllable.length) {
                    this.syllables.push(Fez.formatSyllable(syllable));
                }
                syllable = [phoneme];
                excess = [];
            }
            else if (syllable[0]?.stress && syllable[0].stress < syllable.length) {
                syllable.push(phoneme);
            }
            else {
                excess.push(phoneme);
            }
        }
        if (syllable.length) {
            this.lastRawSyllable = Fez.formatSyllable(syllable.concat(excess));
            this.syllables.push(Fez.formatSyllable(syllable));
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
