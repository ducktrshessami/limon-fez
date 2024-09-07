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

    public addLeaf(fez: Fez): this {
        // TODO: implement
        return this;
    }
}

export class SyllableTreeBranch extends SyllableTreeRoot {
    public readonly leaves: DataSet<Fez>;

    constructor(public readonly parent: SyllableTreeRoot | SyllableTreeBranch, public readonly phoneme: string) {
        super();
        this.leaves = new DataSet<Fez>();
    }
}
