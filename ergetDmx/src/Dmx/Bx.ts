//图片底层库
//使用方法：
//Assert.Img("xxx")，直接得到库中的图片
//Assert.Img("xx/xxx.png")，加载外部图片
class Bx extends eui.Image implements Ix {
    public this = this;
    public base: boolean = false;
    public depth: number;
    public val: any;
    public loaded: boolean = false;
    public loadedFunc: Function;
    public loadedFuncList: Arr<Function>;

    public constructor(val: any) {
        super();

        this.depth = Number.MIN_VALUE;
        this.addEventListenerBx(egret.Event.REMOVED, Bx.OnRemove);

        if (val) {
            this.SetVal(val);
        }
    }

    public SetVal(val: any) {
        if (val instanceof egret.Texture) {
            throw new Error("Do not use system Texture");
            //this.SetBitmap(val);
        } else if (val instanceof Textures) {
            this.SetBitmap(val);
        } else {
            if ((<string>val).length >= 4 && (<string>val).substr(0, 4) == "Res/") {
                this.SetBitmap(val);
            } else {
                //let texture = RES.getRes(val);

                let texture = Assert.assertList[val];
                if (texture) {
                    this.SetBitmap(Textures.GetTextures(texture));
                } else {
                    texture = RES.getRes(val);
                    if (texture) {
                        this.SetBitmap(Textures.GetTextures(texture));
                    } else {
                        // if (Js.showTrace) {
                        //     throw new Error("Error Assert Img: " + val);
                        // }
                        if (Js.showTrace) {
                            Js.Trace("Error Assert Img: " + val);
                        }
                    }
                }
            }
        }
        this.name = val;
    }

    private InfoChanged(key: string, oldValue: any, newValue: any, insert: boolean, obj: any) {
        if (parent == null) {
            if (!this.disposed) {
                NForm.SetTimeout(100, () => {
                    this.InfoChanged(key, oldValue, newValue, insert, obj);
                });
            }
        }
        else {
            if (key == "depth") {
                var parent: any = this.parent;
                if (parent) {
                    parent.setChildIndex(this, parent.numChildren - 1);
                    for (var i: number = parent.numChildren - 1; i >= 0; i--) {
                        var child1: any = parent.getChildAt(i);
                        if (child1 instanceof Sx || child1 instanceof Bx) {
                            var child: any = (child1);
                            if (!child["disposed"]) {
                                if (child.depth > newValue && child != this) {
                                    parent.setChildIndex(this, i);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private static OnRemove(ev: egret.Event): void {
        //if(ev.currentTarget == ev.target)
        {
            if (ev.target instanceof Bx && ev.target.autoDispose) {
                ev.target.Dispose();
            }
        }
    }


    public SetBitmap(val: any): void {
        if (this.disposed) {
            return;
        }
        this.val = val;
        if (val instanceof egret.Texture) {
            throw new Error("Do not use system Texture");
            // this.texture = val;
            // this.loaded = true;
            // if (this.loadedFunc) {
            //     this.loadedFunc();
            // }
            // if (this.loadedFuncList) {
            //     this.loadedFuncList.Each((fi) => {
            //         fi();
            //     });
            // }
        } else if (val instanceof Textures) {
            val.UseTexture(this);
            this.loaded = true;
            if (this.loadedFunc) {
                this.loadedFunc();
            }
            if (this.loadedFuncList) {
                this.loadedFuncList.Each((fi) => {
                    fi();
                });
            }
        } else {
            Src.Read(val, ((textures: Textures) => {
                if (textures) {
                    this.SetBitmap(textures);
                } else {
                    this.loaded = true;
                    if (this.loadedFunc) {
                        this.loadedFunc();
                    }
                    if (this.loadedFuncList) {
                        this.loadedFuncList.Each((fi) => {
                            fi();
                        });
                    }
                }
            }).bind(this));
            //this.source = val;
        }
    }

    public set bitmapData(val: any) {
        if (this.disposed) {
            return;
        }
        if (this.bitmapData == null) {
            this.source = val;
        } else {
            if (this.source != val) {
                this.SetBitmap(val);
            }
        }
    }

    public Dispose(): void {
        if (!this.disposed) {
            this.disposed = true;
            if (this.textures) {
                this.textures.UnUseTexture();
            }
            this.clearEventListener();
            this.listenerArr = null;
            if (this.OnDisposeList) {
                var OnDisposeList = this.OnDisposeList;
                this.OnDisposeList = null;
                OnDisposeList.Each((fi: Function) => {
                    try {
                        fi();
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                });
                this.OnDisposeList.Clear();
            }
            // if (this.OnLoadList) {
            //     this.OnLoadList.Clear();
            //     this.OnLoadList = null;
            // }
            if (this.onShowList) {
                this.onShowList.Clear();
                this.onShowList = null;
            }
            if (this.onHideList) {
                this.onHideList.Clear();
                this.onHideList = null;
            }
            if (this.onPosList) {
                this.onPosList.Clear();
                this.onPosList = null;
            }
            if (this.loadedFuncList) {
                this.loadedFuncList.Clear();
                this.loadedFuncList = null;
            }
            this.loadedFunc = null;
        }
    }

    ////////////////////////////////
    public autoDispose: boolean = true;
    private listenerArr: Arr<Object>;
    public addEventListenerBx(type: string, listener: Function, u: boolean = false, p: number = 0, w: boolean = false): void {
        this.addEventListener(type, listener, this);
        if (this.listenerArr == null) {
            this.listenerArr = new Arr<Object>();
        }
        var obj: Object = { type: type, listener: listener };
        this.listenerArr.Add(obj);
        if (type != egret.Event.REMOVED) {
            this.mouseEnabled = true;
        }
    }

    public removeEventListenerBx(type: string, listener: Function, u: boolean = false) {
        this.removeEventListener(type, listener, this);
        if (this.listenerArr) {
            for (var i: number = 0, len: number = this.listenerArr.length; i < len; i++) {
                var fi: any = this.listenerArr[i];
                if (fi.type == type && fi.listener == listener) {
                    this.listenerArr.removeItemAt(i);
                    break;
                }
            }
        }
    }

    private onlyRemoveEventListener(type: string, listener: Function, u: boolean = false) {
        super.removeEventListener(type, listener, this);
    }

    public clearEventListener(): void {
        if (this.listenerArr && this.listenerArr.length > 0) {
            this.listenerArr.Each((fi: any) => {
                this.onlyRemoveEventListener(fi.type, fi.listener);
            });
            this.listenerArr.Clear();
        }
    }

    public LocalX(globalX: number): number {
        return this.globalToLocal(globalX, 0).x;
    }

    public LocalY(globalY: number): number {
        return this.globalToLocal(0, globalY).y;
    }

    public get globalX(): number {
        return this.localToGlobal(0, 0).x;
    }

    public get globalY(): number {
        return this.localToGlobal(0, 0).y;
    }

    public set scale(val: Vector2) {
        this.scaleX = 0.01 * val.x;
        this.scaleY = 0.01 * val.y;
    }

    public get display(): boolean {
        return this.visible;
    }

    public Show(): void {
        if (this.followSx && !this.followSx.visible) {
            return;
        }
        this.visible = true;
    }

    public Hide(): void {
        this.visible = false;
    }

    public _top: any;
    public get tops(): any {
        if (this._top) {
            return this._top;
        } else if (this.parent && this.parent instanceof Sx) {
            return (this.parent as Sx).tops;
        }
        return null;
    }

    private _x: number = 0;
    public get x(): number {
        return this._x;
    }

    public set x(val: number) {
        this._x = val;
        super.$setX(val);
        if (this.onPosList) {
            this.onPosList.Each((fi: Function) => {
                fi(this.x, this.y);
            });
        }
    }

    private _y: number = 0;
    public get y(): number {
        return this._y;
    }

    public set y(val: number) {
        this._y = val;
        super.$setY(val);
        if (this.onPosList) {
            this.onPosList.Each((fi: Function) => {
                fi(this.x, this.y);
            });
        }
    }

    public get position(): Vector2 {
        return new Vector2(this._x, this._y);
    }

    public set position(val: Vector2) {
        if (this.parent == null) {
            if (this.x != val.x) {
                this.x = val.x;
            }
            if (this.y != val.y) {
                this.y = val.y;
            }
        } else {
            if (this.x != val.x || this.y != val.y) {
                //Form.LazyCall((() => {
                this.x = val.x;
                this.y = val.y;
                //}).bind(this));
                this._x = val.x;
                this._y = val.y;
            }
        }
    }

    public Pos(x: number, y: number): Ix {
        this.position = new Vector2(x, y);
        return this;
    }

    public Scale(x: number, y: number): Ix {
        this.scale = new Vector2(x, y);
        return this;
    }

    public PutCenter(): void {
        super.$setX(this._x - this.width / 2);
    }

    public PutRight(): void {
        super.$setX(this._x - this.width);
    }

    private onPosList: Arr<Function>;
    public OnPos(func: Function): void {
        if (this.onPosList == null) {
            this.onPosList = new Arr<Function>();
        }
        this.onPosList.Add(func);
    }

    public OnPosSplice(func: Function): void {
        this.onPosList.Remove(func);
    }

    public RemoveMe(): void {
        try {
            if (!this.disposed) {
                if (this.parent) {
                    this.parent.removeChild(this);
                } else {
                    if (this.autoDispose) {
                        this.Dispose();
                    }
                }
            }
        } catch (ex) {
            Js.Trace(ex);
        }
    }

    public get topVisible(): boolean {
        if (!this.visible) {
            return false;
        }
        if (this.parent && this.parent instanceof Sx) {
            return (this.parent as Sx).topVisible;
        }
        if (this.parent) {
            return this.parent.visible;
        }
        return false;
    }

    // public get Top(): Ix {
    //     if (this.parent && this.parent instanceof Sx) {
    //         return (this.parent as Sx).Top;
    //     }
    //     return null;
    // }

    private OnDisposeList: Arr<Function>;
    public OnDispose(func: Function): void {
        if (this.OnDisposeList == null) {
            this.OnDisposeList = new Arr<Function>();
        }
        this.OnDisposeList.Add(func);
    }

    private onShowList: Arr<Function>;
    public OnShow(func: Function): void {
        if (this.onShowList == null) {
            this.onShowList = new Arr<Function>();
        }
        this.onShowList.Add(func);
    }

    private onHideList: Arr<Function>;
    public OnHide(func: Function): void {
        if (this.onHideList == null) {
            this.onHideList = new Arr<Function>();
        }
        this.onHideList.Add(func);
    }

    public OnShowSplice(func: Function): void {
        this.onShowList.Remove(func);
    }

    public OnHideSplice(func: Function): void {
        this.onHideList.Remove(func);
    }

    public get visible() {
        return this.$visible;
    }

    public set visible(val: boolean) {
        super.$setVisible(val);
        if (val) {
            if (this.onShowList) {
                this.onShowList.Each((fi: Function) => {
                    try { fi(); } catch (ex) {
                        Js.Trace(ex);
                    }
                });
            }
        } else {
            if (this.onHideList) {
                this.onHideList.Each((fi: Function) => {
                    try { fi(); } catch (ex) {
                        Js.Trace(ex);
                    }
                });
            }
        }
    }

    public To(stateTo: any, time: number = 1000, func: Function = null, parseHandle: Function = null): ActLite {
        return ActLite.To(this, stateTo, time, func, parseHandle);
    }

    public ToPath(stateTo: any, func: Function = null, parseHandle: Function = null): any {
        var index: number = 0;
        var nextFunc: Function = () => {
            if (index >= stateTo.length) {
                nextFunc = null;
                if (func) {
                    func();
                }
            } else {
                var item: any = stateTo[index];
                index++;
                var time: number = item["time"];
                delete item["time"];
                this.To(item, time, () => {
                    nextFunc();
                }, parseHandle);
            }
        };
        nextFunc();
    }

    // private OnLoadList: Arr<Function>;
    // public CallLoad(): void {
    //     if (!this.disposed) {
    //         if (this.OnLoadList) {
    //             this.OnLoadList.Each((fi)=>  {
    //                 try {
    //                     fi();
    //                 } catch (ex) {
    //                     Js.Trace(ex);
    //                 }
    //             });
    //         }
    //     }
    // }

    public OnLoaded(func: Function): void {
        if (this.loaded) {
            func();
        } else {
            if (this.loadedFuncList == null) {
                this.loadedFuncList = new Arr<Function>();
            }
            this.loadedFuncList.Add(func);
        }
    }

    private followSx: any;
    public Follow(sx: any, offsetX: any = null, offsetY: any = null, delay: number = 0, followDispose: boolean = true, followVisible: boolean = true): void {
        this.followSx = sx;
        if (offsetX == null) {
            offsetX = 0;
        }
        if (offsetY == null) {
            offsetY = 0;
        }
        sx.OnPos((x: number, y: number) => {
            if (delay > 0) {
                NForm.SetTimeout(delay, () => {
                    if (offsetX instanceof Function) {
                        this.x = offsetX(x);
                    } else {
                        this.x = x + offsetX;
                    }
                    if (offsetY instanceof Function) {
                        this.y = offsetY(y);
                    } else {
                        this.y = y + offsetY;
                    }
                });
            } else {
                if (offsetX instanceof Function) {
                    this.x = offsetX(x);
                } else {
                    this.x = x + offsetX;
                }
                if (offsetY instanceof Function) {
                    this.y = offsetY(y);
                } else {
                    this.y = y + offsetY;
                }
            }
        });
        if (offsetX instanceof Function) {
            this.x = offsetX(sx.x);
        } else {
            this.x = sx.x + offsetX;
        }
        if (offsetY instanceof Function) {
            this.y = offsetY(sx.y);
        } else {
            this.y = sx.y + offsetY;
        }
        if (followDispose) {
            sx.OnDispose(() => {
                this.Dispose();
            });
        }
        if (followVisible) {
            sx.OnShow(() => {
                this.Show();
            });
            sx.OnHide(() => {
                this.Hide();
            });
            if (sx.visible) {
                this.Show();
            } else {
                this.Hide();
            }
        }
    }

    public disposed: boolean = false;

    public _mouseChildren: boolean = true;
    public get mouseChildren(): boolean {
        return this._mouseChildren;
    }

    public set mouseChildren(val: boolean) {
        this._mouseChildren = val;
    }

    public _mouseEnabled: boolean = true;
    public get mouseEnabled(): boolean {
        return this._mouseEnabled;
    }

    public set mouseEnabled(val: boolean) {
        this._mouseEnabled = val;
        this.touchEnabled = val;
    }
    private _align: number = 0;
    public get align(): number {
        return this._align;
    }

    public set align(val: number) {
        if (val == 1) {
            this.PutCenter();
        } else if (val == 2) {
            this.PutRight();
        }
        this._align = val;
    }

    private _textures: Textures;
    public set textures(textures: Textures) {
        this._textures = textures;
        this.texture = textures.GetTexture();
    }

    public get textures(): Textures {
        return this._textures;
    }

    // public Tip(text: any, func: Function = null, sprite: any = null): void {
    //     var this = this;
    //     Form.LazyCall(() => {
    //         if (Sx.TipFunc) {
    //             Sx.TipFunc(this, text, func, sprite);
    //         }
    //     });
    // }


    // private _scrollRect: Rectangle;
    // public get scrollRect(): Rectangle {
    //     return this._scrollRect;
    // }

    // public set scrollRect(val: Rectangle) {
    //     this.fillMode = "clip";
    //     // this.left = val.x;
    //     // this.top = val.y;
    //     this.width = val.width;
    //     this.height = val.height;
    //     //this.matrix = new egret.Matrix(1, 0, 0, 1, 0, -val.y);//egret.Matrix可以伪3D
    //     this._scrollRect = val;
    // }
}

window["Bx"] = Bx;