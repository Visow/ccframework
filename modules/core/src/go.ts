
export class Go {
    protected static SGenWrapId: number = 0;

    protected _isValid: boolean = true;
    public get isValid() { return this._isValid; }

    private __uuid: string = '';
    private __cid__: string = '';

    private $hashCode: number = 0;
    protected get hashCode(): number {
        if (!this.$hashCode) {
            this.$hashCode = Go.SGenWrapId++;
        }
        return this.$hashCode;
    }

    public get uuid() {
        if (!this.__uuid) {
            this.__uuid = this['__cid__'] + this.hashCode;
        }
        return this.__uuid;
    }

    public equal(b: Go) {
        return this.uuid == b.uuid;
    }
}