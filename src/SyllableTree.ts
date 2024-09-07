import DataSet from "./DataSet";
import Fez from "./Fez";

export class SyllableTreeRoot {
    public readonly children: Map<string, SyllableTreeBranch>;

    constructor() {
        this.children = new Map<string, SyllableTreeBranch>();
    }

    protected ensureChild(phoneme: string): SyllableTreeBranch {
        let child = this.children.get(phoneme);
        if (!child) {
            child = new SyllableTreeBranch(this, phoneme);
            this.children.set(phoneme, child);
        }
        return child;
    }

    public addLeaves(fez: Fez): void {
        if (fez.syllableCount !== 1) {
            return;
        }
        const child = this.ensureChild(fez.lastRawSyllable[0].phoneme);
        child.addLeaves(fez, 1);
    }
}

export class SyllableTreeBranch extends SyllableTreeRoot {
    public readonly leaves: DataSet<Fez>;

    constructor(public readonly parent: SyllableTreeRoot | SyllableTreeBranch, public readonly phoneme: string) {
        super();
        this.leaves = new DataSet<Fez>();
    }

    public addLeaves(fez: Fez, index: number = 0): void {
        if (index < fez.lastRawSyllable.length) {
            const child = this.ensureChild(fez.lastRawSyllable[index].phoneme);
            child.addLeaves(fez, index + 1);
        }
        else {
            this.leaves.add(fez);
        }
    }
}
