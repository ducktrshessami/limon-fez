import { Phoneme } from "node-cmudict";
import DataSet from "./DataSet";
import Fez from "./Fez";
import { mapEvery } from "./util";

export type SyllableTreeNode = SyllableTreeRoot | SyllableTreeBranch;

abstract class BaseSyllableTreeNode {
    public readonly children: Map<string, SyllableTreeBranch>;

    constructor() {
        this.children = new Map<string, SyllableTreeBranch>();
    }

    get empty(): boolean {
        return mapEvery(this.children, child => child.empty);
    }

    public ensureChild(phoneme: string): SyllableTreeBranch {
        let child = this.children.get(phoneme);
        if (!child) {
            child = new SyllableTreeBranch(this as unknown as SyllableTreeNode, phoneme);
            this.children.set(phoneme, child);
        }
        return child;
    }
}

export class SyllableTreeRoot extends BaseSyllableTreeNode {
    public addLeaves(fez: Fez): void {
        if (fez.syllableCount === 1 && fez.lastRawSyllable.length) {
            let node: SyllableTreeBranch = this as unknown as SyllableTreeBranch;
            for (const phoneme of fez.lastRawSyllable) {
                node = node.ensureChild(phoneme.phoneme);
            }
            node.leaves.add(fez);
        }
    }

    public getLeaves(phonemes: Phoneme[]): DataSet<Fez> {
        let result = new DataSet<Fez>();
        for (let i = 0, node = this.children.get(phonemes[i].phoneme); node && i < phonemes.length; i++, node = node.children.get(phonemes[i].phoneme)) {
            result = result.concat(node.leaves);
        }
        return result;
    }
}

export class SyllableTreeBranch extends BaseSyllableTreeNode {
    public readonly leaves: DataSet<Fez>;

    constructor(public readonly parent: SyllableTreeNode, public readonly phoneme: string) {
        super();
        this.leaves = new DataSet<Fez>();
    }

    get empty(): boolean {
        return this.leaves.size === 0 && super.empty;
    }
}
