# limon-fez

"Halo, more like Gaylo!"

Generate a random, nonsense phrase that rhymes with an input string using [cmusphinx/cmudict](https://github.com/cmusphinx/cmudict).

## Usage

```ts
import { Limon } from "limon-fez";

const limon = Limon.getInstance();

// [OPTIONAL] Set a custom dictionary
const dict: Map<string, Entry>; // import { Entry } from "node-cmudict";
limon.setDict(dict);

// [OPTIONAL] Manually parse dictionary
limon.init();

console.log(limon.exec("halo")); // E.g. "gaylo"
```

## FAQ

#### Why is it called limon-fez?

"It's a nonsense bit I do to subvert conversation as conversations continue to depreciate in value in an age of comprehension and attention deficiencies." → Downward Spiral → spiral energy → Simon → Simon Says → Limon Fez

#### Is this really a FAQ? It looks like I'm the first person other than you to even see this repo, so how would these be _frequently_ asked?

C:
