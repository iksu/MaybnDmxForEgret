//图片按钮类
//使用方法
// let b = new NSButton("xxxx");//这里的参数可以使用图片索引，也可以是Sx精灵
// this.Add(b, 100, 100);
// b.Click(() => {
// });
class NSButton extends Sx {
    public obj: any;
    public music: string = null;

    private filterDoubleClickTime: number = -1;
    private _filterDoubleClick: boolean = false;

    public static musicBG: string = null;

    public b: any;
    public bOn: any

    public constructor(b: any, bOn: any = null, music: string = null, highLight: boolean = true, filterDoubleClickTime: number = -1) {
        super();
        this.b = b;
        this.bOn = bOn;

        if (music == null) {
            music = NSButton.musicBG;
        }
        this.music = music;
        this.filterDoubleClickTime = filterDoubleClickTime;
        if (typeof b == "string") {
            b = Assert.Img(b);
            let load = new egret.Shape();
            load.graphics.beginFill(0x000000, 0);
            load.graphics.drawRect(0, 0, 100, 40);
            load.graphics.endFill();
            this.Add(load);
            b.OnLoaded((() => {
                this.RemoveDisplayObject(load);
            }).bind(this));
        }
        if (typeof bOn == "string") {
            bOn = Assert.Img(bOn);
        }

        if (b instanceof Bx) {
            b.OnLoaded(() => {
                if ((b.width <= 50 || b.height <= 50)) {
                    if (b.width <= 50 && b.height <= 50) {
                        this.SetHitArea(new Rectangle(-16, -12, b.width + 32, b.height + 24), false);
                    } else if (b.width <= 50) {
                        this.SetHitArea(new Rectangle(-16, -12, b.width + 32, b.height), false);
                    } else {
                        this.SetHitArea(new Rectangle(-16, -12, b.width, b.height + 24), false);
                    }
                }
            });
        }
        if (bOn) {
            bOn.Hide();
            this.Add(bOn);
        }

        this.Add(b);
        this.obj = b;

        this.buttonMode = true;
        if (highLight) {
            if (bOn) {
                this.Down(() => {
                    bOn.Show();
                    b.alpha = 0;
                });
                this.OutAndUp(() => {
                    bOn.Hide();
                    b.alpha = 1;
                });
                this.Up(() => {
                    bOn.Hide();
                    b.alpha = 1;
                });
            } else {
                this.Down(() => {
                    b.filters = Filters.highLightFilter;
                });
                this.OutAndUp(() => {
                    b.filters = null;
                });
                this.Up(() => {
                    b.filters = null;
                });
            }
        }

        var that = this;
        if (filterDoubleClickTime > 0) {
            this.Click((ev: Event) => {
                if (filterDoubleClickTime > 0) {
                    if (!this._filterDoubleClick) {
                        this._filterDoubleClick = true;
                        this.filters = Filters.grayFilter;
                        NForm.SetTimeout(filterDoubleClickTime, () => {
                            this.filters = null;
                            this._filterDoubleClick = false;
                        });
                    } else {
                        ev.stopImmediatePropagation();
                    }
                }
            });
        }
        if (Strx.IsFull(music)) {
            this.Click(() => {
                if (Strx.IsFull(music)) {
                    Music.Play(music);
                }
            });
        }
        this.ResetWidthHeight();
    }

    public Dispose(): void {
        this.obj = null;
        super.Dispose();
    }

    public get width(): number {
        if (this.obj && this.obj instanceof N9) {
            return this.obj.width;
        }
        else if (super.Width() > 0) {
            return super.Width();
        }
        else if (this.obj && this.obj.width > 0) {
            return this.obj.width;
        }
        return super.Width();
    }

    public get height(): number {
        if (this.obj && this.obj instanceof N9) {
            return this.obj.height;
        }
        else if (super.Height() > 0) {
            return super.Height();
        }
        else if (this.obj && this.obj.height > 0) {
            return this.obj.height;
        }
        return super.Height();
    }

    public On() {
        if (this.bOn) {
            this.b.Hide();
            this.bOn.Show();
        }
    }

    public Off() {
        if (this.bOn) {
            this.b.Show();
            this.bOn.Hide();
        }
    }
}

window["NSButton"] = NSButton;