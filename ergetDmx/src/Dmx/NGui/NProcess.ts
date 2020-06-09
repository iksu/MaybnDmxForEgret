//进度条类
//使用方法：
// let process = new NProcess("panelpfg", "panelpbg", null, -1, true);
// NForm.CenterExtra(process, 0, 30);//居中显示
// this.Add(process);
class NProcess extends Sx {
    public static textStyle: number = 201;
    private _fg: Bx;
    private _fgName: string;
    private pFg: Sx;
    private _bg: Bx;
    public l: any;
    private _width: number;
    private _height: number;
    private scroll: boolean;
    private scrollDis: egret.Shape;
    public _val: number = 0;

    private fgWidth: number = 0;
    private fgHeight: number = 0;
    private processFunc: Function;
    public tweenTime: number = 100;

    public scrollType: number = 0;

    private isheight: boolean;

    public constructor(fg: any, bg: any = null, l: any = null, width: number = -1, scroll: boolean = false, processFunc: Function = null, isheight: boolean = false) {
        super();
        this.isheight = isheight;
        if (l == null) {
            l = new NLabel("", 0xffffff, false, 20);
        } else {
            if (l.val == "") {
                l.val = " ";
            }
        }

        if (typeof fg == "string") {
            fg = Assert.Img(fg);
            this._fgName = fg;
        }
        if (typeof bg == "string") {
            bg = Assert.Img(bg);
        }

        this._bg = <Bx>bg;
        this.l = l;
        this.scroll = scroll;
        this.fgWidth = fg.width;
        this.fgHeight = fg.height;
        this.processFunc = processFunc;
        if (width <= 0) {
            if (bg) {
                this._width = bg.width;
                this._height = bg.height;
            } else {
                this._width = fg.width;
                this._height = fg.height;
            }
        } else {
            if (isheight) {
                this._height = width;
                if (bg) {
                    bg.height = width;
                }
                fg.height = width;
            } else {
                this._width = width;
                if (bg) {
                    bg.width = width;
                }
                fg.width = width;
            }
        }
        if (bg) {
            this.Add(bg);
        }
        this.pFg = new Sx();
        this.Add(this.pFg);
        this.fg = fg;
        this.SetVal(0);

        l.align = 1;
        this.Add(l, this._width / 2, (fg.height - l.height) / 2);
    }

    public set fgName(val: string) {
        if (this._fgName != val) {
            this._fgName = val;
            this.fg = Assert.Img(val);
        }
    }

    public set fg(val: Bx) {
        this._fg = <Bx>val;
        this.pFg.RemoveAll();
        this.pFg.Add(this._fg);
        if (this.scroll) {
            if (!this.scrollDis) {
                let shape = new egret.Shape();
                shape.graphics.beginFill(0x000000, 1);
                shape.graphics.drawRect(0, 0, val.width, val.height);
                shape.graphics.endFill();
                this.Add(shape);

                this._fg.mask = shape;

                this.scrollDis = shape;
            }
            //this._fg.scrollRect = new Rectangle(0, 0, this.fgWidth, this._fg.height);
        }
    }

    public get fg(): Bx {
        return this._fg;
    }

    public get val() {
        return this._val;
    }

    public set val(val: number) {
        this.SetVal(val);
        this._val = val;
    }

    public SetVal(val: number = 100, tweenTime: number = 0): void {
        if (this.disposed) {
            return;
        }
        if (tweenTime > 0) {
            ActLite.To(this, { val: val }, tweenTime, () => { });
            return;
        }
        if (val > 100) {
            val = 100;
        }
        val = val.ToInt();
        if (val <= 0) {
            if (this.scrollDis && this.isheight) {
                ActLite.To(this.scrollDis, { scaleY: 0 }, 500);
            }
            this.fg.Hide();
            //(<egret.DisplayObject><any>this.fg).alpha = 0;
            return;
        } else {
            this.fg.Show();
            //(<egret.DisplayObject><any>this.fg).alpha = 1;
        }
        this._val = val;
        try {
            if (val < 0) {
                val = 0;
            }
            if (this.scroll) {
                if (this.height > 0) {
                    if (this.scrollType == 1) {
                        this.scrollDis.scaleY = val / 100;
                        this.scrollDis.y = this.height * (100 - val) / 100;
                    } else {
                        //this.scrollDis.scaleX = val / 100;
                        this.fg.scrollRect = new Rectangle(0, 0, this._width * val / 100, this.height);
                    }
                    //this.fg.mask = this.scrollDis;
                }
                if (this.processFunc) {
                    this.processFunc();
                }
            } else {
                this.fg.width = this._width * val / 100;
                if (this.processFunc) {
                    this.processFunc();
                }
            }
        } catch (ex) {
            Js.Trace(ex);
        }
    }

    public SetText(val: string): void {
        this.l.val = val;
    }

    public get width(): number {
        if (this._fg instanceof NSprite) {
            if (this._bg && this._bg.$bitmapData) {
                return this._bg.$bitmapData.width;
            }
            if (this._fg.$bitmapData) {
                return this._fg.$bitmapData.width;
            }
        } else {
            if (this._bg) {
                return this._bg.width;
            }
            return this._fg.width;
        }
        return 0;
    }

    public get height(): number {
        if (this._fg instanceof NSprite) {
            if (this._bg && this._bg.$bitmapData) {
                return this._bg.$bitmapData.height;
            }
            if (this._fg.$bitmapData) {
                return this._fg.$bitmapData.height;
            }
        } else {
            if (this._bg) {
                return this._bg.height;
            }
            return this._fg.height;
        }
        return 0;
    }
}

window["NProcess"] = NProcess;