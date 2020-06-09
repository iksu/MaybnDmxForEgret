//外部图片
//可以由Assert.Img("xxx/xxx.jpg");代替
class NSprite extends Bx {
    public constructor(path: string, width: number = 0, height: number = 0) {
        super(null);
        this.loadedFunc = () => {
            if (width > 0) {
                this.width = width;
            } else {
                if (this.width <= 0) {
                    this.width = this.$bitmapWidth;
                }
            }
            if (height > 0) {
                this.height = height;
            } else {
                if (this.height <= 0) {
                    this.height = this.$bitmapHeight;
                }
            }
            if (this.align == 1) {
                this.PutCenter();
            }
            else if (this.align == 2) {
                this.PutRight();
            }
        };


        if (path.length >= 4 && (path.StartWith(Config.src) || path.StartWith("http"))) {
            this.SetBitmap(path);
        } else {
            this.SetBitmap(RES.getRes(path));
        }
    }
}

window["NSprite"] = NSprite;