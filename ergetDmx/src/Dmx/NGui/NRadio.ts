class NRadio extends Sx {
    public w: number;
    public h: number;
    private act: Function;
    public data: Array<any>;
    public checkList: Listx;
    private checkedCheck: NCheck;
    public onChanged: Function;
    private rowCount: number;
    private mode: number = 0;

    public constructor(data: Array<any>, w: number, h: number, act: Function = null, onChanged: Function = null, columnCount: number = 9999, mode: number = 0) {
        super();
        this.checkList = new Listx();
        this.data = data;
        this.act = act;
        this.onChanged = onChanged;
        this.rowCount = columnCount;
        this.mode = mode;
        this.w = w;
        this.h = h;

        for (var i: number = 0; i < data.length; i++) {
            this.AddCheck(data[i], w, h, i);
        }
        this.selectIndex = 0;
    }

    private AddCheck(val: string, width: number, height: number, i: number): void {
        var check: NCheck = new NCheck(val, width, height, this.act);
        var x: number = 0;
        var y: number = 0;
        if (this.mode == 0) {
            x = width * (i % this.rowCount);
            y = height * (Math.floor(i.ToInt() / this.rowCount));
        }
        this.Add(check, x, y);
        this.checkList.s(val, check);
        check.check = false;
        check.Click(() =>{
            this.selectIndex = i;
        });
    }

    private _selectIndex: number;
    public get selectIndex(): number {
        return this._selectIndex;
    }

    public set selectIndex(val: number) {
        if (this.checkedCheck) {
            this.checkedCheck.check = false;
        }
        this.checkedCheck = this.checkList.GetValue(val);
        this.checkedCheck.check = true;
        this._selectIndex = val;
        if (this.onChanged) {
            NForm.LazyCall(() => {
                this.onChanged(val);
            });
        }
        this.PutPos();
    }

    public get selectItem(): NCheck {
        return this.checkList.GetValue(this._selectIndex);
    }

    public get select(): string {
        return this.data[this.selectIndex];
    }

    public set select(val: string) {
        for (var i: number = 0, len: number = this.data.length; i < len; i++) {
            if (this.data[i] == val) {
                this.selectIndex = i;
                this.PutPos();
                return;
            }
        }
    }

    private PutPos(): void {
        var check: NCheck;
        var i: number;
        var len: number;
        if (this.mode == 1) {
            //for (i = 0, len = this.selectIndex; i < len; i++) {
            //    check: = this.checkList.GetValue(i);
            //    check.depth = -Math.abs(this.selectIndex - i);
            //    var x: number = this._width / 3 * ((i - this.selectIndex) % this.rowCount) - this._width * 2 / 3;
            //    check.To({ x: x }, 200);

            //    var matrix: Matrix3D = new Matrix3D(Vector.<Number>([
            //        1, 0, 0.4, 0,
            //        0, 1, 0, 0,
            //        0, 0, 1, 0,
            //        0, 0, 0, 1]));
            //}

            //check = this.checkList.GetValue(this.selectIndex);
            //check.depth = 999;
            //check.To({ x: 0 }, 200);
            //matrix = new Matrix3D(Vector.<Number>([
            //    1, 0, 0, 0,
            //    0, 1, 0, 0,
            //    0, 0, 1, 0,
            //    0, 0, 0, 1]));

            //for (i = this.selectIndex + 1, len = this.checkList.Length; i < len; i++) {
            //    check = this.checkList.GetValue(i);
            //    check.depth = -Math.abs(this.selectIndex - i);
            //    x = this._width / 3 * ((i - this.selectIndex) % this.rowCount) + this._width * 4 / 5;
            //    check.To({ x: x }, 200);

            //    matrix = new Matrix3D(Vector.<Number>([
            //        0.25, 0, -0.4, 0,
            //        0, 0.85, 0, 0,
            //        0, 0, 1, 0,
            //        0, 30, 0, 1]));
            //}
        } else if (this.mode == 2) {
            for (var j: number = 0, len1: number = this.selectIndex; j < len1; j++) {
                check = this.checkList.GetValue(j);
                check.depth = -Math.abs(this.selectIndex - j);
                var x1: number = this.w / 3 * (10 % this.rowCount) + this.w;
                check.To({ x: x1 }, 200);

                check.scaleX = 0.7;
                check.scaleY = 0.7;
            }

            check = this.checkList.GetValue(this.selectIndex);
            check.depth = 999;
            check.To({ x: 0 }, 200);

            check.scaleX = 1;
            check.scaleY = 1;

            for (i = this.selectIndex + 1, len = this.checkList.Length; i < len; i++) {
                check = this.checkList.GetValue(i);
                check.depth = -Math.abs(this.selectIndex - i);
                x1 = this.w / 3 * ((i - this.selectIndex) % this.rowCount) + this.w * 2 / 3;
                check.To({ x: x1 }, 200);

                check.scaleX = 0.7;
                check.scaleY = 0.7;
            }
        }
    }

    private static aniIco: Sx;
    public static Ani(ico: Sx): void {
        if (this.aniIco == ico) {
            return;
        }
        if (this.aniIco) {
            this.aniIco.filters = null;
        }
        if (this.aniIco != ico) {
            this.aniIco = ico;
            //this.aniIco.filters = Filters.highLightFilter;
            this.DoAni(this.aniIco);
        }
    }

    private static DoAni(ico: Sx): void {
        if (!ico.topVisible) {
            return;
        }
        if (this.aniIco != ico) {
            ico.To({ y: 0 }, 500);
            return;
        }
        ico.To({ y: 10 }, 500, ()=> {
            if (this.aniIco != ico) {
                ico.To({ y: 0 }, 500);
                return;
            }
            ico.To({ y: -10 }, 500, ()=> {
                this.DoAni(ico);
            });
        });
    }
}

window["NRadio"] = NRadio;