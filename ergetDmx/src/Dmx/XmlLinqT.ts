class XmlLinqT extends Observer {
    private OnListAddList: Arr<Function>;
    private OnRemoveList: Arr<Function>;
    private OnChangedList: Arr<Function>;
    public _staticData: boolean = false;
    public _path: string;
    public _pathKey: string;

    public _names: Arr<string>;

    public constructor() {
        super();
        this._names = new Arr<string>();
        this.changedFuncList.Add(this.DoChanged.bind(this));
    }

    private DoChanged(key: string, oldList: Listx, list: Listx) {
        if (typeof key == "undefined") {
            //throw new Error("key undefined");
            return;
        }
        // if (list._parent == this) {
        //     return;
        // }
        this._names.Remove(key);
        //if (this._sortKey == null || typeof this._sortKey == "string" && Strx.IsEmpty(this._sortKey)) {
        this._names.Add(key);
        // }
        // else {
        //     let isString = typeof this._sortKey == "string";
        //     let val: string = null;
        //     if (isString) {
        //         val = list.g(this._sortKey);
        //     }
        //     else if (this._sortKey instanceof Function) {
        //         val = this._sortKey(list);
        //     }
        //     let doIt: boolean = true;
        //     if (val) {
        //         let index: number = 0;
        //         this.Each((fi: Listx): boolean => {
        //             let val1: string;
        //             if (isString) {
        //                 val1 = fi.g(this._sortKey);
        //             }
        //             else if (this._sortKey instanceof Function) {
        //                 val1 = this._sortKey(fi);
        //             }
        //             let bigger: boolean = false;
        //             if (Number(val).toString() == val && Number(val1).toString() == val1) {
        //                 if (Number(val) >= Number(val1)) {
        //                     bigger = true;
        //                 }
        //                 else {
        //                     bigger = false;
        //                 }
        //             }
        //             else {
        //                 if (val.charCodeAt(0) >= val1.charCodeAt(0)) {
        //                     bigger = true;
        //                 }
        //                 else {
        //                     bigger = false;
        //                 }
        //             }
        //             if (bigger && this._sortDesc || !bigger && !this._sortDesc) {
        //                 this._names.InsertAt(key, index);
        //                 doIt = false;
        //                 return true;
        //             }
        //             index++;
        //         });
        //     }
        //     if (doIt) {
        //         this._names.Add(key);
        //     }
        // }
        if (this.OnListAddList) {
            this.OnListAddList.Each((fi) => {
                fi(list);
            });
        }
        list.changedFuncList.Add(this.ItemDoChanged.bind(this));
        list._parent = this;
    }

    private ItemDoChanged(key: string, oldValue: any, newValue: any, item: Listx) {
        if (this.OnChangedList) {
            for (let fi_key_a in this.OnChangedList.source) {
                if (fi_key_a != "Each") {
                    let fi: any = this.OnChangedList.source[fi_key_a];
                    fi(key, oldValue, newValue, item);
                }
            }
        }
    }

    public Remove(name: string) {
        if (this.Exists(name)) {
            if (this.OnRemoveList) {
                this.OnRemoveList.EachDesc(((fi) => {
                    try {
                        if (fi) {
                            fi(name, this[name]);
                        }
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                }).bind(this));
            }
            try {
                this._names.Remove(name);//TODO:这句话在重连的时候有问题？
                this[name].changedFuncList.Remove(this.ItemDoChanged);
                super.Remove(name);
            } catch (ex) {
                Js.Trace(ex);
            }
        }
    }

    public GetName(index: number): string {
        if (this._names.length > index) {
            return this._names.getItemAt(index);
        }
        return "";
    }

    public GetValue(index: number): Listx {
        let name: string = this.GetName(index);
        if (Strx.IsFull(name)) {
            return this.g(name);
        }
        return null;
    }

    public Exists(name: string): boolean {
        return super.Exists(name);
    }

    public get Length(): number {
        return this._names.length;
    }

    public get length(): number {
        return this._names.length;
    }

    public OnAdd(act: Function, sx: Ix) {
        if (this.OnListAddList == null) {
            this.OnListAddList = new Arr<Function>();
        }
        this.OnListAddList.Add(act);
        sx.OnDispose(() => {
            if (this.OnListAddList) {
                this.OnListAddList.Remove(act);
            }
        });
    }


    public OnRemove(act: Function, sx: Ix) {
        if (this.OnRemoveList == null) {
            this.OnRemoveList = new Arr<Function>();
        }
        this.OnRemoveList.Add(act);
        sx.OnDispose(() => {
            if (this.OnRemoveList) {
                this.OnRemoveList.Remove(act);
            }
        });
    }

    public OnChanged(act: Function, sx: Ix) {
        if (this.OnChangedList == null) {
            // this.Each((fi: Listx) => {
            //     fi.changedFuncList.Add(that.ItemDoChanged.bind(this));
            // });
            this.OnChangedList = new Arr<Function>();
        }
        this.OnChangedList.Add(act);
        sx.OnDispose(() => {
            if (this.OnChangedList) {
                this.OnChangedList.Remove(act);
            }
        });
    }

    public OnAddSplice(act: Function) {
        if (this.OnListAddList) {
            this.OnListAddList.Remove(act);
        }
    }

    public OnRemoveSplice(act: Function) {
        if (this.OnRemoveList) {
            this.OnRemoveList.Remove(act);
        }
    }

    public OnChangedSplice(act: Function) {
        if (this.OnChangedList) {
            this.OnChangedList.Remove(act);
        }
    }

    public ListenEmpty(act: Function, id: string, key: string, sx1: Ix) {
        if (this._staticData) {
            throw new Error("Static Data Can Not be Binded");
        }
        let item: Listx;
        //let sx: Sx;
        if (this.Exists(id)) {
            item = (<Listx>(this.g(id)));
            //sx = new Sx();
            //sx.autoDispose = false;
            item.Listen(() => {
                //act(item.g(key));
                act(item[key]);
            }, key, sx1);
        }
        else {
            act("");
        }
        let act1 = (item1: Listx) => {
            let id1 = item1["id"];
            if (id == id1) {
                // if (sx) {
                //     sx.Dispose();
                // }
                item = item1;
                //sx = new Sx();
                //sx.autoDispose = false;
                item.Listen(() => {
                    //act(item.g(key));
                    act(item[key]);
                }, key, sx1);
            }
        };
        this.OnAdd(act1, sx1);
        let act2 = (id1: string) => {
            if (id == id1) {
                // if (sx) {
                //     sx.Dispose();
                // }
                act("");
            }
        };
        this.OnRemove(act2, sx1);
        let act3 = () => {
            // if (sx) {
            //     sx.Dispose();
            //     sx = null;
            // }
            this.OnAddSplice(act1);
            this.OnRemoveSplice(act2);
            act1 = null;
            act2 = null;
            act3 = null;
        };
        sx1.OnDispose(act3);
    }

    public GetPageSize(pageSize: number): number {
        let rv = Math.ceil(this.Length / pageSize);
        if (rv <= 0) {
            rv = 1;
        }
        return rv;
    }

    public GetPage(pageSize: number, page: number): XmlLinqT {
        let xqt: XmlLinqT = new XmlLinqT();
        for (let i = pageSize * page, len = pageSize * page + pageSize; i < len; i++) {
            try {
                let name: string = this.GetName(i);
                if (Strx.IsFull(name)) {
                    let item: Listx = this.g(name);
                    if (item) {
                        xqt.Add(item);
                    }
                }
            } catch (ex) {
                Js.Trace(ex);
            }
        }
        return xqt;
    }

    // public Each(func: Function): void {
    //     this._names.Each(((name) => {
    //         try {
    //             let val: Listx = this.g(name);
    //             if (func(val)) {
    //                 return true;
    //             }
    //         } catch (ex) {
    //             Js.Trace(ex);
    //         }
    //         return false;
    //     }).bind(this));
    // }
    public Each(func: Function): void {
        this.EachKey((name) => {
            try {
                //Js.Trace(name);
                let val: Listx = this.g(name);
                if (func(val)) {
                    return true;
                } else {
                    return false;
                }
            } catch (ex) {
                Js.Trace(ex);
            }
        });
    }


    public Take(size: number, skip: number = 0): XmlLinqT {
        let xqt: XmlLinqT = new XmlLinqT();
        let index: number = 0;
        this.Each((item: Listx) => {
            try {
                if (index >= skip && index < skip + size) {
                    xqt.Add(item);
                }
                if (index >= skip + size) {
                    return true;
                }
                index++;
            } catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return xqt;
    }

    public s(key: string, val: any): void {
        throw new Error("XmlLinqT: please use Add instead.");
        //Js.Trace("XmlLinqT: please use Add instead.");
        //this.Add(val);
    }

    public Where(func: Function): XmlLinqT {
        let xqt = new XmlLinqT();
        this.Each((item: Listx) => {
            try {
                if (func(item)) {
                    xqt.Add(item);
                }
            } catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return xqt;
    }

    public Reverse(): XmlLinqT {
        let xqt = new XmlLinqT();
        let list = this.ToArray();
        list.reverse().forEach(((fi) => {
            if (fi) {
                xqt.Add(fi);
            }
        }).bind(this));
        return xqt;
    }

    public Copy(): XmlLinqT {
        let xqt = new XmlLinqT();
        this.Each((item: Listx) => {
            try {
                xqt.Add(item);
            } catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return xqt;
    }

    public Count(func: Function): number {
        let rv = 0;
        this.Each((item: Listx) => {
            if (func(item)) {
                rv++;
            }
            return false;
        });
        return rv;
    }

    public All(func: Function): boolean {
        let rv = true;
        this.Each((item: Listx) => {
            try {
                if (!func(item)) {
                    rv = false;
                    return true;
                }
            } catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    }

    public Any(func: Function): boolean {
        let rv = false;
        this.Each((item: Listx) => {
            try {
                if (func(item)) {
                    rv = true;
                    return true;
                }
            } catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    }

    public FirstOrDefault(func: Function): Listx {
        let rv: Listx;
        this.Each((item: Listx) => {
            try {
                if (func(item)) {
                    rv = item;
                    return true;
                }
            } catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    }

    public Max(func: Function): number {
        //let rv = Number.MIN_VALUE;
        let rv = -Number.MAX_VALUE;
        this.Each((item: Listx) => {
            try {
                rv = Math.max(rv, func(item));
                return false;
            } catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    }

    public Min(func: Function): number {
        let rv = Number.MAX_VALUE;
        this.Each((item: Listx) => {
            try {
                rv = Math.min(rv, func(item));
                return false;
            } catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    }

    public MaxItem(func: Function): Listx {
        if (this.Length == 0) {
            return null;
        }
        let maxVal: number = this.Max(func);
        return this.FirstOrDefault((item: any) => {
            try {
                return func(item) == maxVal;
            } catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
    }

    public Sum(func: Function): number {
        let rv = 0;
        this.Each((item: Listx) => {
            try {
                rv += func(item);
                return false;
            } catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    }

    public Select(func: Function): Array<any> {
        let list: Array<any> = [];
        this.Each((item: Listx) => {
            try {
                list.push(func(item));
            } catch (ex) {
                Js.Trace(ex);
            }
        });
        return list;
    }

    public ToArray(): Array<Listx> {
        return this.Select((fi) => {
            try {
                return fi;
            } catch (ex) {
                Js.Trace(ex);
            }
        });
    }

    public RemoveAll(func: Function): XmlLinqT {
        let xqt = new XmlLinqT();
        this.Each(xi => {
            if (!func(xi)) {
                xqt.Add(xi);
            }
        });
        return xqt;
    }

    public OrderBy(key: any): XmlLinqT {
        if (key == null) {
            return this;
        }
        let xqt = new XmlLinqT();
        if (key instanceof Function) {
            let list = this.ToArray().sort((a, b) => {
                try {
                    return key(a) - key(b);
                } catch (ex) {
                    Js.Trace(ex);
                }
                return 0;
            });
            list.forEach((fi) => {
                xqt.Add(fi);
            });
        } else {
            let list = this.ToArray().sort((a, b) => {
                try {
                    return a[key].ToInt() - b[key].ToInt();
                } catch (ex) {
                    Js.Trace(ex);
                }
                return 0;
            });
            list.forEach((fi) => {
                xqt.Add(fi);
            });
        }
        // if (key instanceof Function) {
        //     this.Each( (item: Listx)=> {
        //         try {
        //             xqt.Add(item);
        //             return false;
        //         } catch (ex) {
        //             Js.Trace(ex);
        //         }
        //         return false;
        //     });
        // } else {
        //     this.Each( (item: Listx)=> {
        //         try {
        //             xqt.Add(item);
        //             return false;
        //         } catch (ex) {
        //             Js.Trace(ex);
        //         }
        //         return false;
        //     });
        // }
        return xqt;
    }

    public GroupBy(func: Function): Listx {
        let list = new Listx();
        this.Each((item: Listx) => {
            let key = func(item);
            if (!list.Exists(key)) {
                list[key] = new XmlLinqT();
            }
            list[key].Add(item);
        });
        return list;
    }

    public Add(item: Listx, keys: any = null) {
        item.CreateGSS(keys);
        let key = item["id"];
        super.s(key, item);
    }

    public AddKey(key: string, item: Listx) {
        super.s(key, item);
    }

    public Text(): string {
        return Listx.GetArrText(this.ToArray());
    }

    //这里的无法正确清除，使用base.Clear();
    public Clear(): void {
        super.Clear();
        this._names.Each((fi) => {
            delete this[fi];
            delete this["_" + fi];
        });
        this._names.Clear();
        this.ResetLength();
    }

    public Dispose() {
        if (this.OnListAddList) {
            this.OnListAddList.Clear();
            this.OnListAddList = null;
        }
        if (this.OnRemoveList) {
            this.OnRemoveList.Clear();
            this.OnRemoveList = null;
        }
        if (this.OnChangedList) {
            this.OnChangedList.Clear();
            this.OnChangedList = null;
        }
        for (let fi in this) {
            delete this[fi];
        }
        super.Dispose();
    }
}


window["XmlLinqT"] = XmlLinqT;