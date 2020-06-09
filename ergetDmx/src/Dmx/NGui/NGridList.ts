//以XmllinqT为数据源的表格类
//一般用于物品列表等等
//使用方法：
// this.g = new NGridList(this.w, this.h, 2);
// let xqt = new XmlLinqT();
// for(let i=0;i<25;i++){
//     var list = new Listx();
//     list["id"] = i.toString();
//     list["index"] = i;
//     xqt.Add(list);
// }
// this.g.SetData(xqt, this.h / xqt.length, (p, list) => {
//     p.Add(new NLabel(list["index"]));
// });
// this.Add(this.g);
///<reference path="NScrollPanel.ts" />

class NGridList extends NScrollPanel {
    public static empty = new Listx();
    public column: number = 1;
    private _emptyToCount: number = 0;
    public get emptyToCount(): number {
        return this._emptyToCount;
    }
    public set emptyToCount(val: number) {
        this._emptyToCount = val;
    }
    private OnAdd: Function;
    private OnRemove: Function;
    public sxList: Listx;
    private emptyList: Arr<Sx>;
    public animation: boolean = false;
    public freeStyle: boolean = false;

    public cellWidth: number;
    public cellHeight: number;
    public func: Function;
    public data: XmlLinqT;
    public margin: number;
    public defaultPanel: Sx;
    public defaultFunc: Function;

    public orderByFunc: Function;

    public autoHide: boolean = false;

    public constructor(w: number, h: number, column: number, emptyToCount: number = 0) {
        super(w, h);
        if (NGridList.empty == null) {
            NGridList.empty = Listx.Arr("id|");
        }
        this.w = w;
        this.h = h;
        this.column = column;
        if (column <= 0) {
            this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
        } else {
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.cellWidth = w / column;
        }

        this.autoHide = true;
        //this.scroller.throwSpeed = 1;
        //this.scroller.throwSpeed = 0;

        this.emptyToCount = emptyToCount;
        this.sxList = new Listx();
        this.emptyList = new Arr<Sx>();

        this.OnAdd = (list) => {
            if (this.data) {
                if (!this.disposed) {
                    let y = this.scroller.viewport.scrollV;
                    this.AddOne(list);
                    this.LoadEmpty();
                    this.LoadPosition();
                    NForm.LazyCall(() => {
                        //this.scroller.viewport.scrollV = y.Max(this.h - this.rowCount * this.cellHeight);//加上这句会出错
                        this.HandleScrollHide();
                    });
                }
            }
        };
        this.OnRemove = (id) => {
            if (this.data) {
                if (!this.disposed) {
                    if (this.sxList.Exists(id)) {
                        let y = this.scroller.viewport.scrollV;
                        this.sxList[id].Dispose();
                        this.sxList.Remove(id);
                        this.LoadEmpty();
                        this.LoadPosition();
                        NForm.LazyCall(() => {
                            //this.scroller.viewport.scrollV = y.Max(this.h - this.rowCount * this.cellHeight);//加上这句会出错
                            this.HandleScrollHide();
                        });
                    }
                }
            }
        };

        this.OnScrollerEnd((ev) => {
            this.HandleScrollHide();
        });
    }

    public HandleScrollHide() {
        if (this.freeStyle) {
            return;
        }
        if (!this._disableScroll && !this._disableMask) {
            if (this.sxList) {
                this.sxList.Each(((fi) => {
                    this.LoadOne(fi);
                }).bind(this));
            }
        }
    }

    public _whereFunc: Function;
    public get whereFunc() {
        return this._whereFunc;
    }
    public set whereFunc(val: Function) {
        this._whereFunc = val;
        if (this.sxList) {
            this.sxList.Each((fi: Sx) => {
                fi.SetTemp("hide", 0);
            });
        }
    }

    private baseChildren = new Arr<any>();
    private AddBase(sx: Ix, x: number = 0, y: number = 0): Sx {
        if (this.disposed) {
            return this;
        }
        //sx.ui.SetParent(this.scrollRect.content, false);//TODO:
        if (x == 0 && y == 0) {
        }
        else {
            sx.x = x;
            sx.y = y;
        }
        this.baseChildren.Add(sx);
        this.Add(sx);
        return this;
    }

    public RemoveAllBase() {
        if (this.disposed) {
            return;
        }
        this.baseChildren.Each((fi) => {
            fi.RemoveMe();
        });
    }

    public SetData(xes: XmlLinqT, cellHeight: number, func: Function, willListen: boolean = false, margin: number = 0) {
        if (this.disposed) {
            return;
        }
        if (this.data) {
            this.data.OnAddSplice(this.OnAdd);
            this.data.OnRemoveSplice(this.OnRemove);
        }
        if (this.column <= 0) {
            this.cellWidth = cellHeight;
        }
        this.cellHeight = cellHeight;
        if (this.column <= 0) {
            this.cellWidth = cellHeight;
        }
        this.func = func;
        this.margin = margin;
        if (xes == null) {
            return;
        }
        this.data = xes;
        this.Reload();
        if (willListen) {
            xes.OnAdd(this.OnAdd, this);
            xes.OnRemove(this.OnRemove, this);
        }
    }

    public Reload() {
        if (this.disposed) {
            return;
        }
        this.sxList.Clear();
        this.emptyList.Clear();
        this.RemoveAllBase();
        var allCount = Math.max(this.emptyToCount, this.data.Length);
        this.data.Each(((fi) => {
            this.AddOne(fi);
        }).bind(this));
        this.LoadEmpty();
        this.LoadPosition();
    }

    private AddOne(list: Listx) {
        if (this.disposed) {
            return;
        }
        var p = new Sx();
        //var p = new NPanel(this.cellWidth, this.cellHeight, 1);//调试查看范围使用

        let n9 = new N9("gridlistempty");
        n9.width = this.cellWidth;
        n9.height = this.cellHeight;
        let shape = new NSButton(n9);

        // let shape = new egret.Shape();
        // shape.graphics.beginFill(0x000000, 1);
        // shape.graphics.drawRect(0, 0, this.cellWidth, this.cellHeight);
        // shape.graphics.endFill();

        p.Add(shape);

        p.SetTemp("shape", shape);

        this.AddBase(p);
        p.SetTemp("list", list);
        this.sxList.s(list["id"], p);
    }

    private LoadEmpty() {
        if (this.disposed) {
            return;
        }
        var index: number = this.sxList.Length;
        var count = this.emptyToCount - index;
        if (count > this.emptyList.length) {
            for (var i = this.emptyList.Count; i < count; i++) {
                var p = new Sx();
                let shape = new N9("gridlistempty");
                shape.width = this.cellWidth;
                shape.height = this.cellHeight;
                p.Add(shape);

                p.SetTemp("empty", "1");
                p.SetTemp("shape", shape);

                this.emptyList.Add(p);
                this.AddBase(p);
            }
        }
        else if (count < this.emptyList.Count) {
            for (var i = count; i < this.emptyList.Count; i++) {
                if (this.emptyList.Count > 0) {
                    this.emptyList.getItemAt(0).Dispose();
                    //this.emptyList[0].Dispose();
                    this.emptyList.RemoveAt(0);
                }
            }
        }
    }

    public rowCount: number = 0;
    public LoadPosition() {
        if (this.disposed) {
            return;
        }
        if (!this.data) {
            return;
        }
        var columnIndex = 0;
        var rowIndex = 0;
        var allCount = Math.max(this.emptyToCount, this.data.Length);
        var index = 0;

        if (this.cellHeight <= 0) {
            var yoffset = 0;
            //TODO:where orderby
            this.sxList.Each((fi: Sx) => {
                if (this.whereFunc) {
                    if (!this.whereFunc(fi.GetTemp("list"))) {
                        fi.SetTemp("hide", 1);
                        fi.Hide();
                        fi.Pos(0, -1000);
                        return;
                    }
                }
                fi.Show();
                fi.y = yoffset;
                yoffset += fi.height + this.margin;
            });
            rowIndex = 1;
        }
        else {
            let list = this.sxList;
            if (this.orderByFunc) {
                let keys = list.keys.sort((a, b) => {
                    try {
                        let lista = list[a].GetTemp("list");
                        let listb = list[b].GetTemp("list");
                        // if (lista == NGridList.empty) {
                        //     return -1;//TODO:
                        // }
                        // if (listb == NGridList.empty) {
                        //     return 1;//TODO:
                        // }
                        return this.orderByFunc(lista) - this.orderByFunc(listb);
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                    return 0;
                });
                keys.forEach(((k) => {
                    let fi = list[k];
                    if (this.PutOne(fi, columnIndex, rowIndex)) {
                        if (this.column <= 0 || columnIndex < this.column - 1) {
                            columnIndex++;
                        }
                        else {
                            columnIndex = 0;
                            rowIndex++;
                        }
                        index++;
                    }
                }).bind(this));
            } else {
                list.Each((fi) => {
                    if (this.PutOne(fi, columnIndex, rowIndex)) {
                        if (this.column <= 0 || columnIndex < this.column - 1) {
                            columnIndex++;
                        }
                        else {
                            columnIndex = 0;
                            rowIndex++;
                        }
                        index++;
                    }
                });
            }
            if (this.emptyList) {
                this.emptyList.Each((fi) => {
                    if (this.PutOne(fi, columnIndex, rowIndex)) {
                        if (!this.freeStyle) {
                            if (this.animation) {
                                fi.To(columnIndex * this.cellWidth + columnIndex * this.margin, rowIndex * this.cellHeight);
                            }
                            else {
                                fi.Pos(columnIndex * this.cellWidth + columnIndex * this.margin, rowIndex * this.cellHeight);
                            }
                        }
                        if (this.column <= 0 || columnIndex < this.column - 1) {
                            columnIndex++;
                        }
                        else {
                            columnIndex = 0;
                            rowIndex++;
                        }
                        index++;
                    }
                });
            }
        }
        this.rowCount = rowIndex;
        if (this.sxList) {
            if (this.sxList.Count((fi: Sx) => { return fi.visible }) == 0) {
                if (this.defaultFunc) {
                    if (!this.defaultPanel) {
                        this.defaultPanel = new Sx();
                        this.defaultFunc(this.defaultPanel);
                        this.AddBase(this.defaultPanel);
                    }
                    this.defaultPanel.Show();
                }
            } else {
                if (this.defaultPanel) {
                    this.defaultPanel.Hide();
                }
            }
        }
        // Form.LazyCall(() => {
        //     this.scroller.viewport.scrollV = 0;
        //     this.HandleScrollHide();
        // });
    }

    private PutOne(p: Sx, columnIndex: number, rowIndex: number) {
        if (this.whereFunc) {
            let list = p.GetTemp("list");
            if (list && !this.whereFunc(list)) {
                p.SetTemp("hide", 1);
                p.Hide();
                p.Pos(0, -1000);
                return false;
            }
        }
        p.Show();
        if (!this.freeStyle) {
            if (this.animation) {
                p.To(columnIndex * this.cellWidth + columnIndex * this.margin, rowIndex * this.cellHeight);
            }
            else {
                p.Pos(columnIndex * this.cellWidth + columnIndex * this.margin, rowIndex * this.cellHeight);
            }
        }
        this.LoadOne(p);
        return true;
    }

    private LoadOne(p: Sx) {
        if (p.GetTemp("hide") == 1) {
            p.Hide();
            return;
        }
        if (!p.isLoaded) {
            //Js.Trace(p.globalX + ":" + p.globalY + ":" + this.x + ":" + this.y + ":" + this.w + ":" + this.h);
            if (this.freeStyle || !this.autoHide || this.column <= 0 && this.visibleInScrollH(p, this.cellWidth) || this.column > 0 && this.visibleInScrollV(p, this.cellHeight)) {
                let list = p.GetTemp("list");
                p.isLoaded = true;
                if (list) {
                    try {
                        this.func(p, list);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                } else {
                    try {
                        this.func(p, NGridList.empty);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                }
                //let shape = p.GetTemp("shape");//触发范围需要自己去写了
                //shape.width = p.width;
                //shape.height = p.height;
            }
        } else {
            if (this.freeStyle || !this.autoHide || this.column <= 0 && this.visibleInScrollH(p, this.cellWidth) || this.column > 0 && this.visibleInScrollV(p, this.cellHeight)) {
                p.Show();
            } else {
                p.Hide();
            }
        }
    }

    public get width(): number {
        return this.w;
    }

    public get height(): number {
        return this.h;
    }

    public Dispose() {
        this.disposed = true;
        this.sxList.Clear();
        this.sxList = null;
        this.emptyList.Clear();
        this.emptyList = null;
        if (this.data) {
            this.data.OnAddSplice(this.OnAdd);
            this.data.OnRemoveSplice(this.OnRemove);
        }
        this.data = null;
        this.OnAdd = null;
        this.OnRemove = null;
        if (this.baseChildren) {
            this.baseChildren.Each((fi) => {
                if (fi.autoDispose) {
                    fi.Dispose();
                }
                else {
                    fi.ui.SetParent(NForm.stage);
                    fi.ui.gameObject.SetActive(false);
                }
            });
            this.baseChildren.Clear();
            this.baseChildren = null;
        }
        super.Dispose();
    }
}

window["NGridList"] = NGridList;