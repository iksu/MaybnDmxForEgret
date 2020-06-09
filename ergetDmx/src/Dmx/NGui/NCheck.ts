class NCheck extends Sx {
    public static offStyle: Function;
    public static onStyle: Function;
    public static fontSize: number;

    public val: string;
    public l: Ix;
    public b: Sx;
    private act: Function;
    private p: NPanel;
    private fg: any;

    public constructor(val: string, width: number, height: number, act: Function,color:number=0xfffbd4) {
        super();
        this.val = val;
        this.act = act;

        this.b = new Sx();
        this.Add(this.b);

        if (act == null) {
            var bg = NCheck.offStyle();
            this.b.Add(bg);

            this.fg = NCheck.onStyle();
            this.fg.Hide();
            this.b.Add(this.fg);

            if (val.length > 2 && val.substr(0, 2) == "i:") {
                this.l = Assert.Img(val.substr(2, val.length - 2));
                this.Add(this.l, bg.width + 3, (bg.height - this.l.height) / 2);
            } else {
                this.l = new NLabel(val, 0xfffbd4, false, NCheck.fontSize);
                //this.l.filters = Filters.borderFilter;
                this.Add(this.l, bg.width + 2, (bg.height - this.l.height) / 2);
            }
        }
        else {
            this.p = new NPanel(width, height);
            act(this.p, val);

            var b: NSButton = new NSButton(this.p);
            this.b.Add(b, 0, 0);
        }

        if (act == null) {
            var hit: Sx = new Sx();
            this.Add(hit);
            //				hit.beginFill(0x0);
            //				hit.drawRect(0,0,30,30);
            //				hit.endFill();
            //				hitArea=hit;//TODO:hitArea
            hit.Hide();
        }
    }

    private _check: boolean;
    public get check(): boolean {
        return this._check;
    }

    public set check(val: boolean) {
        this._check = val;

        if (this.p ) {
            if (val) {
                //this.p.filters = Filters.highLightFilter;
            } else {
                this.p.filters = null;
            }
        } else {
            this.fg.visible = val;
        }
    }
}

window["NCheck"] = NCheck;