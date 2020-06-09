//基础数据类型
//使用方法：
// var list = new Listx();
// list["id"] = "1;
// list["index"] = "1";
///<reference path="Strx.ts" />
///<reference path="Observer.ts" />

interface String {
    //Arr(): Listx;
    ArrList(): Array<Listx>;
    Xqt();
}

// if (!String.prototype.Arr) {
//     String.prototype.Arr = function () {
//         return Listx.GetArr(this);
//     };
// }

if (!String.prototype.ArrList) {
    String.prototype.ArrList = function () {
        return Listx.GetArrList(this);
    };
}

if (!String.prototype.Xqt) {
    String.prototype.Xqt = function () {
        return Listx.GetXmlLinqT(this);
    };
}

class Listx extends Observer {
    public _staticData: boolean = false;
    public _parent: XmlLinqT;

    public constructor() {
        super();
    }

    public static _listenCount: number;
    private static get listenCount(): number {
        return Listx._listenCount;
    }

    private static set listenCount(val: number) {
        Listx._listenCount = val;
    }

    public static listenTraced: boolean;
    private static TraceListen() {
        Listx.listenTraced = false;
        // Form.LazyCall(function () {
        //     if (!Listx.listenTraced) {
        //         Js.TraceDmx("Listen Count:" + Listx.listenCount);
        //         Listx.listenTraced = true;
        //     }
        // });
    }

    public Listen(act: Function, key: string, sx: Ix) {
        var that: any = this;
        if (this._staticData) {
            throw new Error("Static Data Can Not be Binded");
        }
        if (sx == null) {
            throw new Error("sx is null");
        }
        if (key && !this.Exists(key)) {
            this[key] = "";
        }
        Listx.listenCount++;
        Listx.TraceListen();
        var act1 = () => {
            that.changedFuncList.Remove(act2);
            act1 = null;
            act2 = null;
            Listx.listenCount--;
            Listx.TraceListen();
        };
        var act2 = (_key: string, oldValue: any, newValue: any, obj: any) => {
            if (act1 == null) {
                return;
            }
            // if (Js.showTrace) {
            //     if (act1 == null) {
            //         Js.Trace("Error: Disposed when listx listen action!");
            //     }
            // }
            if (key == null) {
                act(_key);
            }
            else if (key == _key) {
                act(oldValue, newValue);
            }
        };
        sx.OnDispose(act1);
        this.changedFuncList.Add(act2);
        if (key) {
            act();
        }

        this.CreateGS(key);
    }

    public ListenArray(act: Function, keys: Array<any>, sx: Ix) {
        var that = this;
        if (this._staticData) {
            throw new Error("Static Data Can Not be Binded");
        }
        Listx.listenCount++;
        Listx.TraceListen();
        var act1 = () => {
            that.changedFuncList.Remove(act2);
            act1 = null;
            act2 = null;
            Listx.listenCount--;
            Listx.TraceListen();
        };
        var act2: Function = function (_key: string, oldValue: any, newValue: any, obj: any) {
            for (var i: number = 0, len: number = keys.length; i < len; i++) {
                if (keys[i] == _key) {
                    act();
                    break;
                }
            }
        };
        sx.OnDispose(act1);
        this.changedFuncList.Add(act2);
        act();

        keys.forEach(function (fi) {
            this.CreateGS(fi);
        }.bind(this));
    }

    public static GetArrList(text: string): Array<Listx> {
        if (Strx.IsEmpty(text)) {//处理空的情况
            return new Array();
        }
        var arr: Array<Listx> = new Array();
        var items: Array<any> = text.split("*");
        for (var i: number = 0, len: number = items.length; i < len; i++) {
            arr.push(Listx.GetArr(items[i]));
        }
        return arr;
    }

    public static GetXmlLinqT(text: string): XmlLinqT {
        var arr: Array<any> = Listx.GetArrList(text);
        var list: XmlLinqT = new XmlLinqT();
        for (var i: number = 0; i < arr.length; i++) {
            list.Add(arr[i]);
        }
        return list;
    }

    public static Arr(text: string): Listx {
        return Listx.GetArr(text);
    }

    public static ArrSmart(text: string): Listx {
        return Listx.GetArrSmart(text);
    }

    public static GetArr(text: string): Listx {
        if (Strx.IsEmpty(text)) {
            return new Listx();
        }
        var list: Listx = new Listx();
        var items: Array<any> = text.split(",");
        var len: number = items.length;
        for (var i: number = 0; i < len; i++) {
            var items1: Array<string> = items[i].split("|");
            if (items1.length >= 2) {
                var key: string = items1[0];
                try {
                    var value: string = items1[1];
                    value = value.replace(/#124;/g, "|").replace(/#42;/g, "*").replace(/#44;/g, ",").replace(/#35;/g, "#");
                    list.s(key, value);
                } catch (ex) {
                    Js.Trace(ex);
                }
            }
        }
        return list;
    }

    public static GetArrSmart(text: string): Listx {
        if (Strx.IsEmpty(text)) {
            return new Listx();
        }
        var list: Listx = new Listx();
        var headLenList = "";
        var headInex = 0;
        for (let i = 0, len = text.length; i < len; i++) {
            var c = text[i];
            if (c == '_') {
                headInex = i;
                break;
            }
            headLenList += c;
        }
        var headLen = headLenList.ToInt();
        headInex++;
        var headText = text.substr(headInex, headLen);
        var lens = headText.split('_');
        var index = headInex + headLen;
        for (let i = 0, len = lens.length; i < len; i++) {
            var l = lens[i].ToInt();
            var k = text.substr(index, l);
            index += l;
            i++;
            l = lens[i].ToInt();
            var v = text.substr(index, l);
            list[k] = v;
            index += l;
        }
        return list;
    }

    public Text(): string {
        var that = this;
        var text: Array<string> = [];
        this.EachKey((fi) => {
            var val: any = that.Get(fi);
            if (val) {
                if (typeof val == "boolean") {
                    if (val) {
                        val = 1;
                    }
                    else {
                        val = 0;
                    }
                }
                var value: string = val.toString().split("#").join("#35;").split("|").join("#124;").split("*").join("#42;").split(",").join("#44;");
                text.push(fi + "|" + value);
            }
        });
        return text.join(",");
    }

    public static GetArrText(arr: Array<Listx>): string {
        var text: Array<any> = [];
        arr.forEach((fi) => {
            text.push(fi.Text());
        });
        return text.join("*");
    }

    public CopyTo(list: Listx) {
        if (this.keys.length > 0) {
            this.keys.forEach((fi) => {
                if (fi.IsFull()) {
                    if (fi.substr(0, 1) == "_") {
                        fi = fi.substr(1, fi.length - 1);
                    }
                    list[fi] = this[fi];
                }
            });
        } else {
            this.EachKey((fi) => {
                list[fi] = this[fi];
            });
        }
    }

    public GetPageSize(pageSize: number): number {
        var rv: number = Math.ceil(this.Length / pageSize);
        if (rv <= 0) {
            rv = 1;
        }
        return rv;
    }

    // public GetPage(pageSize: number, page: number): Listx {
    //     var list: Listx = new Listx();
    //     //        for(var i: number = pageSize * page,len: number = pageSize * page + pageSize;i < len;i++) {
    //     //            var item: any = this.GetValue(i);
    //     //            if(item) {
    //     //                list[this.GetName(i)] = item;
    //     //            }
    //     //        }//TODO
    //     return list;
    // }

    public Take(size: number, skip: number = 0): Listx {
        var list: Listx = new Listx();
        var that = this;
        var index: number = 0;
        this.EachKey(function (fi): boolean {
            if (index >= skip && index < skip + size) {
                list.Set(fi, that.Get(fi));
            }
            if (index >= skip + size) {
                return true;
            }
            index++;
            return false;
        });
        return list;
    }

    public Where(func: Function): Listx {
        var that = this;
        var list: Listx = new Listx();
        this.EachKey((fi) => {
            if (func(fi)) {
                list.Set(fi, that.Get(fi));
            }
        });
        return list;
    }

    public Copy(): Listx {
        var list: Listx = new Listx();
        this.CopyTo(list);
        return list;
    }

    public Count(func: Function = null): number {
        var rv: number = 0;
        this.Each((fi) => {
            if (func(fi)) {
                rv++;
            }
        });
        return rv;
    }

    public Any(func: Function): boolean {
        var rv = false;
        this.EachKey((fi) => {
            if (func(fi)) {
                rv = true;
                return true;
            }
        });
        return rv;
    }

    public All(func: Function): boolean {
        var rv = true;
        this.EachKey((fi) => {
            if (!func(fi)) {
                rv = false;
                return true;
            }
        });
        return rv;
    }

    public FirstOrDefault(func: Function): any {
        let rv = null;
        this.Each((fi) => {
            if (func(fi)) {
                rv = fi;
                return true;
            }
        });
        return rv;
    }

    public Max(func: Function): number {
        //var rv: number = Number.MIN_VALUE;
        var rv: number = -999999999;
        this.Each((fi) => {
            rv = Math.max(rv, func(fi));
        });
        return rv;
    }

    public Min(func: Function): number {
        var rv: number = Number.MAX_VALUE;
        this.Each((fi) => {
            rv = Math.min(rv, func(fi));
        });
        return rv;
    }

    public MaxItem(func: Function): any {
        if (this.Length == 0) {
            return null;
        }
        var maxVal: number = this.Max(func);
        return this.FirstOrDefault(function (item: any): boolean {
            return func(item) == maxVal;
        });
    }

    public toString(): string {
        return this.Text();
    }

    public Dispose() {
        this.Clear();
        this._parent = null;
        super.Dispose();
    }
}

window["Listx"] = Listx;