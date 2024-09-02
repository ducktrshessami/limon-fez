export default class Singleton {
    private static _instance: Singleton;

    protected constructor() {
        if (Singleton._instance) {
            return Singleton._instance;
        }
        Singleton._instance = this;
    }
}
