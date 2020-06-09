//普通Panel类，
//可以带背景，需要载入的时候初始化
//初始化：
// public static Setup(): void {
//     NPanel.bgFunc =  (bgType: number)=> {
//         if (bgType <= -1) {
//             return null;
//         }
//         var bg: any = new N9("winp" + bgType);
//         if (bg instanceof N9) {
//             bg.base = true;
//         }
//         return bg;
//     };
// }
//使用方法：
// let p = new NPanel(100, 100, 1);
// this.Add(p);
class NPanel extends Sx {
    public static bgFunc: Function;

    public showBG: boolean;
    public bg: N9;
    public w: number;
    public h: number;

    public constructor(width: number = 1, height: number = 1, bgType: number = -1) {
        super();
        this.showBG = bgType > -1;
        if (this.showBG) {
            if (NPanel.bgFunc ) {
                this.bg = NPanel.bgFunc(bgType);
                this.bg.OnLoaded((() => {
                    this.bg.width = width;
                    this.bg.height = height;
                }).bind(this));
                let bgp = new Sx();
                bgp.base = true;
                bgp.Add(this.bg);
                this.Add(bgp);
            }
        }
        this.w = width;
        this.h = height;
    }

    public Resize(width: number, height: number): void {
        if (this.showBG && this.bg ) {
            this.bg.width = width;
            this.bg.height = height;
        }
        this.w = width;
        this.h = height;
    }

    public set width(val: number) {
        this.w = val;
        if (this.showBG) {
            this.bg.width = val;
        } else {
        }
    }

    public set height(val: number) {
        if (this.showBG) {
            this.h = val;
            this.bg.height = val;
        } else {
        }
    }

    public get width(): number {
        if (this.showBG) {
            return this.w;
        } else {
            return super.Width();
        }
    }

    public get height(): number {
        if (this.showBG) {
            return this.h;
        } else {
            return super.Height();
        }
    }

    public visiableInStage: boolean = true;

    public InShow(): void {
        this.visiableInStage = true;
        for (var i: number = 0; i < this.numChildren; i++) {
            var item: any = this.getChildAt(i);
            if (item instanceof NPanel) {
                (<NPanel>item).InShow();
            }
            if (item instanceof NSButton) {
                (<NSButton>item).Show();
            }
            if (item instanceof NProcess) {
                (<NProcess>item).Show();
            }
            if (item instanceof Bx) {
                (<Bx>item).Show();
            }
        }
    }

    public InHide(): void {
        this.visiableInStage = false;
        for (var i: number = 0; i < this.numChildren; i++) {
            var item: any = this.getChildAt(i);
            if (item instanceof NPanel) {
                (<NPanel>item).InHide();
            }
            else if (item instanceof NSButton) {
                (<NSButton>item).Hide();
            }
            else if (item instanceof NProcess) {
                (<NProcess>item).Hide();
            }
            else if (item instanceof Bx) {
                (<Bx>item).Hide();
            }
        }
    }

    public Show(): void {
        this.InShow();
        super.Show();
    }

    public Hide(): void {
        this.InHide();
        super.Hide();
    }

    public Add(s1: any, x: number = 0, y: number = 0): boolean {
        if (s1 == null) {
            return false;
        }
        let s = null;
        if (typeof s1 == "string") {
            s = Assert.Img(<string>s1);
        } else {
            s = s1;
        }
        if (!this.disposed) {
            if (s.hasOwnProperty("hasReLoad")) {
                if (s.hasOwnProperty("loaded")) {
                    if (s["loaded"]) {
                    } else {
                        s.Reload();
                        s["loaded"] = true;
                    }
                }
            }
        }
        ///////////////////////////////////
        var rv: boolean = super.Add(s, x, y);
        if (s instanceof NPanel) {
            //(item as NPanel).OnAdd();
        }
        return rv;
    }
}

window["NPanel"] = NPanel;