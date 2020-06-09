///<reference path="Strx.ts" />
class Dictionary extends egret.HashObject {
    private static systemKeys = {
        _xml: true,
        $hashCode: true,
        hashCode: true,
        __class__: true,
        __types__: true,
        _gsKey: true,
        Remove: true,
        _length: true,
        constructor: true,
        CreateGS: true,
        CreateGSS: true,
        s: true,
        Set: true,
        g: true,
        Get: true,
        Clear: true,
        Exists: true,
        GetName: true,
        GetValue: true,
        GetIndex: true,
        EachKey: true,
        Each: true,
        ResetLength: true,
        length: true,
        Length: true,
        keys: true,
        Dispose: true,
        _changedFuncList: true,
        changedFuncList: true,
        Changed: true,
        _staticData: true,
        Listen: true,
        ListenArray: true,
        Text: true,
        CopyTo: true,
        GetPageSize: true,
        GetPage: true,
        Take: true,
        Where: true,
        Copy: true,
        Count: true,
        Any: true,
        RemoveAll: true,
        All: true,
        FirstOrDefault: true,
        Max: true,
        Min: true,
        MaxItem: true,
        toString: true,
        setProperty: true,
        GetOrAdd: true,
        _parent: true,
        Parent: true,
        _sortDesc: true,
        _sortKey: true,
        _names: true,
        DoChanged: true,
        ItemDoChanged: true,
        OnAdd: true,
        OnRemove: true,
        OnChanged: true,
        OnAddSplice: true,
        OnRemoveSplice: true,
        OnChangedSplice: true,
        ListenEmpty: true,
        Sum: true,
        Select: true,
        ToArray: true,
        OrderBy: true,
        GroupBy: true,
        Add: true,
        AddKey: true,
        //index: true,
        _risingChanged: true,
        OnListAddList: true,
        OnRemoveList: true,
        undefined: true,
        OnChangedList: true,
        Reverse: true,
    };

    public _xml: any;
    private _gsKey: egret.HashObject;
    private _risingChanged: boolean = false;
    public constructor() {
        super();
        this._gsKey = new egret.HashObject();
    }

    public CreateGSS(keys: any): void {
        if (keys) {
            for (var fi in keys) {
                this.CreateGS(fi);
            }
        } else {
            this.EachKey(((fi) => {
                this.CreateGS(fi);
            }).bind(this));
        }
    }

    public CreateGS(key: string): void {
        if (!this._gsKey[key]) {
            this._gsKey[key] = true;
            if (this._xml) {
            } else {
                this["_" + key] = this[key];
                delete this[key];
            }

            Object.defineProperty(this, key, {
                set: function (val) {
                    // if (key instanceof Function) {
                    //     key = Strx.Rnd(Number.MAX_VALUE).toString();
                    // }
                    this._risingChanged = false;
                    if (this._xml) {
                        if (this.Exists(key)) {
                            let oldVal: any = this._xml[key];
                            if (oldVal != val || val == null) {
                                this._xml[key] = val;
                                this.Changed(key, oldVal, val);
                                this.ResetLength();
                            }
                        } else {
                            this._xml[key] = val;
                            this.Changed(key, null, val);
                            this.ResetLength();
                        }
                    } else {
                        if (this.Exists(key)) {
                            let oldVal: any = this["_" + key];
                            if (oldVal != val || val == null) {
                                this["_" + key] = val;
                                this.Changed(key, oldVal, val);
                                this.ResetLength();
                            }
                        } else {
                            this["_" + key] = val;
                            this.Changed(key, null, val);
                            this.ResetLength();
                        }
                    }
                },
                get: function () {
                    let val = null;
                    if (this._xml) {
                        val = this._xml[key];
                        if (Strx.IsEmpty(val)) {
                            return "";
                        }
                    } else {
                        val = this["_" + key];
                        if (val) {
                            if (val instanceof Function) {
                                return val;
                            }
                        }
                        if (Strx.IsEmpty(val)) {
                            return "";
                        }
                    }
                    return val;
                }
            });
        }
    }

    public s(key: string, val: any): void {
        this.Set(key, val);
    }

    public Set(key: any, val: any): void {
        this._risingChanged = false;
        if (key instanceof Function) {
            key = Strx.Rnd(Number.MAX_VALUE).toString();
        }
        if (this.Exists(key)) {
            let oldVal: any = this.Get(key);
            if (oldVal != val || val == null) {
                this[key] = val;
                this.Changed(key, oldVal, val);
                this.ResetLength();
            }
        } else {
            this[key] = val;
            this.Changed(key, null, val);
            this.ResetLength();
        }
    }

    public g(key: string): any {
        return this.Get(key);
    }

    public Get(key: string): any {
        if (this._xml) {
            return this._xml[key];
        } else {
            return this[key];
        }
    }

    public Remove(key: string): void {
        if (!Dictionary.systemKeys.hasOwnProperty(key)) {
            delete this[key];
            delete this["_" + key];
            this.ResetLength();
        }
    }

    public Clear(): void {
        // for (let fi in this) {
        //     Js.Trace(fi);
        // }
        // Js.Trace("------------------------");
        this.EachKey(((xi) => {
            // Js.Trace(xi);
            delete this[xi];
            delete this["_" + xi];
        }).bind(this));
        this.ResetLength();
    }

    public Exists(key: string): boolean {
        if (this._xml) {
            return this._xml.hasOwnProperty(key);
        } else {
            return this.hasOwnProperty(key);
            // let rv = false;
            // if (this.keys && this.keys.length > 0) {
            //     rv = this.keys.indexOf(key) > -1;
            // }
            // if (!rv) {
            //     rv = this.hasOwnProperty(key);
            // }
            // return rv;
        }
    }

    public GetOrAdd(key: string, func: Function): any {
        if (this.Exists(key)) {
            return this.g(key);
        } else {
            let rv = func();
            this.s(key, rv);
            return rv;
        }
    }

    public GetName(index: number): string {
        let rv: string = null;
        let i = 0;
        this.EachKey((fi) => {
            if (i == index) {
                rv = fi;
                return true;
            }
            i++;
        });
        return rv;
    }

    public GetValue(index: number): any {
        let key = this.GetName(index);
        return this.g(key);
    }

    public GetIndex(key: string): number {
        let rv = -1;
        let i = 0;
        this.EachKey((fi) => {
            if (fi == key) {
                rv = i;
                return true;
            }
            i++;
        });
        return rv;
    }

    public EachKey(func: Function): void {
        if (this._xml) {
            for (let fi in this._xml) {
                if (func(fi)) {
                    break;
                }
            }
        } else {
            // if (this.keys.length > 0) {
            //     this.keys.forEach((fi) => {
            //         if (fi.IsFull()) {
            //             if (fi.substr(0, 1) == "_") {
            //                 fi = fi.substr(1, fi.length - 1);
            //             }
            //             if (func(fi)) {
            //             }
            //         }
            //     });
            // } else {//暂时注释了，加上后可能会出莫名的问题
            for (let fi in this) {
                if (fi.IsFull() && !Dictionary.systemKeys.hasOwnProperty(fi) && fi.substr(0, 1) != "_") {
                    if (func(fi)) {
                        break;
                    }
                }
            }
            //}
        }
    }

    public Each(func: Function): void {
        if (this._xml) {
            for (let fi in this._xml) {
                if (fi) {
                    if (func(this._xml[fi])) {
                        break;
                    }
                }
            }
        } else {
            for (let fi in this) {
                if (fi) {
                    if (!Dictionary.systemKeys.hasOwnProperty(fi)) {
                        if (func(this[fi])) {
                            break;
                        }
                    }
                }
            }
        }
    }

    public ResetLength() {
        this._length = -1;
    }

    private _length: number = -1;
    public get length(): number {
        if (this._length < 0) {
            this._length = 0;
            if (this._xml) {
                for (let fi in this._xml) {
                    this._length++;
                }
            } else {
                for (let fi in this) {
                    if (!Dictionary.systemKeys.hasOwnProperty(fi)) {
                        this._length++;
                    }
                }
            }
        }
        return this._length;
    }

    public get Length(): number {
        return this.length;
    }

    public get keys(): Array<string> {
        let keys = new Array<string>();
        if (this._xml) {
            for (let fi in this._xml) {
                keys.push(fi);
            }
        } else {
            for (let fi in this) {
                if (!Dictionary.systemKeys.hasOwnProperty(fi)) {
                    keys.push(fi);
                }
            }
        }
        return keys;
    }

    public Dispose() {
        if (this._changedFuncList) {
            this._changedFuncList.Clear();
            this._changedFuncList = null;
        }
    }

    public _changedFuncList: Arr<Function>;
    public get changedFuncList(): Arr<Function> {
        if (this._changedFuncList == null) {
            this._changedFuncList = new Arr<Function>();
        }
        return this._changedFuncList;
    }

    public Changed(key: string, oldValue: any, newValue: any) {
        if (this._risingChanged) {
            return;
        }
        this._risingChanged = true;
        if (this._changedFuncList && this._changedFuncList.length > 0) {
            this._changedFuncList.Each((fi: Function) => {
                try {
                    if (fi) {
                        fi(key, oldValue, newValue, this);
                    }
                    else {
                        Js.Trace("Error:Changed func fi empty");
                    }
                } catch (ex) {
                    Js.Trace(ex);
                }
            });
        }
    }
}

window["Dictionary"] = Dictionary;