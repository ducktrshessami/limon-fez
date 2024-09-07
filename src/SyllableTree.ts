import DataSet from "./DataSet";
import Fez from "./Fez";

export type SyllableTreeNode = SyllableTreeRoot | SyllableTreeBranch;

abstract class BaseSyllableTreeNode {
    public readonly children: Map<string, SyllableTreeBranch>;

    constructor() {
        this.children = new Map<string, SyllableTreeBranch>();
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
}

export class SyllableTreeBranch extends BaseSyllableTreeNode {
    public readonly leaves: DataSet<Fez>;

    constructor(public readonly parent: SyllableTreeNode, public readonly phoneme: string) {
        super();
        this.leaves = new DataSet<Fez>();
    }
}
