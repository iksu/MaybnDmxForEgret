class NScrollPanel extends Sx {
    public view: Sx;
    public scroller: eui.Scroller;
    public bg: any;
    private onScrollerEndList: Array<Function>;
    public w: number;
    public h: number;
    public updateInterval: number;
    private scrollerEnd: Function;

    public constructor(w: number = 1, h: number = 1, updateInterval = 50) {
        super();
        this.view = new Sx();

        this.w = w;
        this.h = h;
        this.updateInterval = updateInterval;

        this.scroller = new eui.Scroller();
        this.scroller.width = w;
        this.scroller.height = h;
        this.scroller.viewport = this.view;
        this.Add(this.scroller);

        if (updateInterval > 0) {
            this.scrollerEnd = this.ScrollerEnd.bind(this);
            this.scroller.addEventListener(egret.Event.CHANGE, this.scrollerEnd, this);
            this.Up(this.scrollerEnd);
        }
        // this.bg = new NPanel(w, h, 15);
        // this.Add(new NSButton(this.bg));
    }

    private scrollerEndIndex = 0;
    private ScrollerEnd(ev) {
        if (!this.disposed) {
            this.scrollerEndIndex++;
            let scrollerEndIndex1 = this.scrollerEndIndex;
            let obj = { scrollH: this.scroller.viewport.scrollH, scrollV: this.scroller.viewport.scrollV };
            NForm.SetTimeout(this.updateInterval, (() => {
                if (!this.disposed) {
                    if (this.scrollerEndIndex == scrollerEndIndex1 || scrollerEndIndex1 % 12 == 0) {
                        if (this.onScrollerEndList) {
                            this.onScrollerEndList.forEach((fi) => {
                                fi(obj);
                            });

                        }
                    }
                }
            }).bind(this));
        }
    }

    public OnScrollerEnd(func) {
        if (!this.onScrollerEndList) {
            this.onScrollerEndList = [];
        }
        this.onScrollerEndList.push(func);
    }

    private ScrollerTouchEnd(ev) {
    }

    public Add(s1: any, x: number = 0, y: number = 0): boolean {
        let s = null;
        if (typeof s1 == "string") {
            s = Assert.Img(<string>s1);
        } else {
            s = s1;
        }

        var that = this;
        if (this.view == null || this.view == s || s instanceof eui.Scroller) {
            return super.Add(s, x, y);
        } else {

            this.view.Add(s, x, y);
        }
        return true;
    }

    public RemoveAll(): void {
        if (this.view == null) {
            return super.RemoveAll();
        } else {
            for (var i = this.view.numChildren - 1; i >= 0; i--) {
                try {
                    var child: any = this.view.getChildAt(i);
                    if (child instanceof Sx) {
                        if (!(child).disposed) {
                            if ((child).base) {
                                continue;
                            }
                        }
                    }
                    this.view.removeChildAt(i);
                } catch (ex) { }
            }
        }
    }

    public BaseAdd(s: any, x: number = 0, y: number = 0): boolean {
        return super.Add(s, x, y);
    }

    public Resize(w: number, h: number) {
        this.scroller.width = w;
        this.scroller.height = h;
    }

    public _disableScroll: boolean = false;
    public DisableScroll() {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this._disableScroll = true;
    }

    public DisableScrollX() {

        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }
    public DisableScrollY() {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
    }

    public EnableScroll() {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.AUTO;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.AUTO;
    }

    public EnableScrollX() {
        this.scroller.scrollPolicyH = eui.ScrollPolicy.AUTO;
    }
    public EnableScrollY() {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.AUTO;
    }

    public _disableMask: boolean = false;
    public DisableMask() {
        this.DisableScroll();
        this.scroller.viewport.scrollEnabled = false;
        this._disableMask = true;
    }

    public set tween(val: boolean) {
        if (val) {
            this.scroller.throwSpeed = 1;
        } else {
            this.scroller.throwSpeed = 0;
        }
    }

    public set bounces(val: boolean) {
        this.scroller.bounces = val;
    }

    public visibleInScrollV(p: Sx, cellHeight: number): boolean {
        if (p.y >= this.scroller.viewport.scrollV && p.y <= this.scroller.viewport.scrollV + this.h
            || p.y + cellHeight >= this.scroller.viewport.scrollV && p.y + cellHeight <= this.scroller.viewport.scrollV + this.h) {
            return true;
        }
        return false;
    }


    public visibleInScrollH(p: Sx, cellWidth: number): boolean {
        if (p.x >= this.scroller.viewport.scrollH && p.x <= this.scroller.viewport.scrollH + this.w
            || p.x + cellWidth >= this.scroller.viewport.scrollH && p.x + cellWidth <= this.scroller.viewport.scrollH + this.w) {
            return true;
        }
        return false;
    }

    public Dispose() {
        this.scroller.removeEventListener(egret.Event.CHANGE, this.scrollerEnd, this);
        if (this.onScrollerEndList) {
            this.onScrollerEndList.length = 0;
        }
        this.onScrollerEndList = null;
        if (this.view) {
            this.view.RemoveMe();
            this.view.Dispose();
        }
        super.Dispose();
    }
}

window["NScrollPanel"] = NScrollPanel;