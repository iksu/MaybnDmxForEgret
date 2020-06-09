//使用图片库进行帧动画
class NAniBx extends NAniBase {
    public constructor(imgs: any, overAndRemove: boolean = true, frameRate: number = 6) {
        super(overAndRemove)
        this.Setup(imgs, frameRate);
    }

    private Setup(imgs: any, frameRate: number = 9) {
        let imgs1: Arr<any> = null;
        if (typeof imgs == "string") {
            imgs1 = new Arr<any>();

            let assertList = Assert.aniAssertList;
            assertList.EachKey((fi) => {
                if (fi.StartWith(imgs + "_")) {
                    imgs1.Add(fi);
                }
            });
        }
        if (imgs1) {
            imgs = imgs1;
        }
        let arr = imgs;
        this.enterFrame = (times) => {
            this.img.SetVal(arr.getItemAt(times));
        };
        this.frameRate = frameRate;
        this.Load(arr);
    }
}

window["NAniBx"] = NAniBx;