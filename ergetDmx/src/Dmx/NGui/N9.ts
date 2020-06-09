//九宫格图片类
//使用方法：
// let bg = new N9("xxx");
// bg.width = NForm.width;
// bg.height = NForm.height;
// this.Add(bg);
class N9 extends Sx {
    public img: Bx;
    public constructor(val: string, rect: Rectangle = null) {
        super();
        this.img = Assert.Img(val);
        this.img.OnLoaded(() => {
            this.img.fillMode = egret.BitmapFillMode.SCALE;
            if (rect == null) {
                this.img.scale9Grid = new Rectangle(this.img.texture.$bitmapWidth / 2, this.img.texture.$bitmapHeight / 2, 1, 1);
            } else {
                this.img.scale9Grid = rect;
            }
        });
        this.Add(this.img);
    }

    public OnLoaded(loaded: Function) {
        this.img.OnLoaded(() => {
            loaded();
        });
    }

    public get width() {
        return this.img.width;
    }

    public set width(val: number) {
        this.img.width = val;
    }

    public get height() {
        return this.img.height;
    }

    public set height(val: number) {
        this.img.height = val;
    }
}

window["N9"] = N9;