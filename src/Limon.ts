import { Entry } from "node-cmudict";
import Singleton from "./Singleton";

export default class Limon extends Singleton {
    private cache: Map<string, Set<Entry>> = new Map();
}
