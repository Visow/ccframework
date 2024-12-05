import { Go } from "./go";

const INS_TAG: string = "__instance__";

export class Singleton extends Go {

    constructor() {
        super();
        if ((<any>this)[INS_TAG] != null) {
            throw new Error(`${this.constructor.name} is a singleton class, cannot be instantiated multiple times`);
        }
    }

    /** 获得单例 */
    public static ins<T extends {}>(this: new () => T): T {
        if (!(<any>this)[INS_TAG]) {
            (<any>this)[INS_TAG] = new this();
        }
        return (<any>this)[INS_TAG];
    }
}