class NButton extends Sx {
    public static bgRender: Function;
    public static bgOnRender: Function;
    public static lRender: Function;
    public static lOnRender: Function;

    private _val: string;
    private bOn: any;

    public l: any;
    public lOn: any;
    public b: NSButton;
    private bg: Bx;
    private bgOn: Bx;

    private filterDoubleClickTime: number = -1;
    private _filterDoubleClick: boolean = false;

    public constructor(val: string, style: number = -1, highLight: boolean = true, filterDoubleClickTime: number = -1) {
        super();
        this._val = val;
        this.filterDoubleClickTime = filterDoubleClickTime;

        ////////////////////////
        this.bg = NButton.bgRender(style);
        let sp = new Sx();
        sp.Add(this.bg);
        if (val.indexOf("/") > -1) {
            this.l = Assert.Img(val);
            this.l.OnLoaded((() => {
                this.l.Pos((this.w - this.l.width) / 2, (this.h - this.l.height) / 2);
            }).bind(this));
            this.l.mouseEnabled = false;
            sp.Add(this.l);
        } else if (val.indexOf(".") > -1) {
            this.l = Assert.Img("lang/" + val);
            this.l.OnLoaded((() => {
                this.l.Pos((this.w - this.l.width) / 2, (this.h - this.l.height) / 2);
            }).bind(this));
            this.l.mouseEnabled = false;
            sp.Add(this.l);
        } else {
            var _val: string = val;
            _val = Lang.PT(_val);

            this.l = NButton.lRender(style, _val, this.bg.width, this.bg.height);
            this.l.mouseEnabled = false;
            sp.Add(this.l);
        }
        ////////////////////////

        ////////////////////////
        this.bgOn = NButton.bgOnRender(style);
        let spOn = null;
        if (this.bgOn) {
            spOn = new Sx();
            spOn.Add(this.bgOn);

            if (val.indexOf(".") > -1) {
                this.lOn = Assert.Img("lang/" + val);
                this.lOn.OnLoaded((() => {
                    this.lOn.Pos((this.w - this.lOn.width) / 2, (this.h - this.lOn.height) / 2);
                }).bind(this));
                this.lOn.mouseEnabled = false;
                spOn.Add(this.lOn);
            } else {
                var _val: string = val;
                _val = Lang.PT(_val);

                this.lOn = NButton.lOnRender(style, _val, this.bg.width, this.bg.height);
                if (this.lOn == null) {
                    this.lOn = NButton.lRender(style, _val, this.bg.width, this.bg.height);
                }
                this.lOn.mouseEnabled = false;
                spOn.Add(this.lOn);
            }
        }
        ////////////////////////

        this.buttonMode = true;

        this.b = new NSButton(sp, spOn, NSButton.musicBG, highLight, filterDoubleClickTime);
        this.Add(this.b);
        var that = this;

        //this.b.Off();
    }

    public get val(): string {
        return this._val;
    }

    public set val(val: string) {
        if (this.l ) {
            this.l.val = val;
        }
        if (this.lOn ) {
            this.lOn.val = val;
        }
        this._val = val;
    }

    public get width(): number {
        return this.bg.width;
    }

    public get height(): number {
        return this.bg.height;
    }

    public get w(): number {
        return this.bg.width;
    }

    public get h(): number {
        return this.bg.height;
    }

    public On() {
        this.b.On();
    }

    public Off() {
        this.b.Off();
    }
}

window["NButton"] = NButton;