//底层类
//纹理管理
//自动实现纹理资源GC
//小游戏中需要载入以下代码
// Msg.Listen("GC", (v) => {
//     wx.triggerGC();
// }, this);
class Textures {
    public tick: number;
    private texture: egret.Texture;
    public path: string;
    public disposed: boolean = false;

    public constructor(texture: egret.Texture, path: string = "") {
        this.tick = 0;
        this.texture = texture;
        this.path = path;
    }

    public get bitmapWidth(): number {
        return this.texture.$bitmapWidth;
    }

    public get bitmapHeight(): number {
        return this.texture.$bitmapHeight;
    }

    public get bitmapData(): egret.BitmapData {
        return this.texture.$bitmapData;
    }

    public GetTexture(): egret.Texture {
        return this.texture;
    }

    public UseTexture(bx: Bx) {
        if (bx.textures) {
            bx.textures.tick--;
        }
        this.tick++;
        bx.textures = this;
        return this;
    }

    public UnUseTexture() {
        this.tick--;
    }

    public Keep() {//防止被回收
        this.tick++;
    }

    public Release() {
        this.tick--;
    }

    public Dispose() {
        if (!this.disposed) {
            this.disposed = true;
            this.texture.disposeBitmapData = true;
            this.texture.dispose();
        }
    }

    public static texturesStatic = new Listx();
    public static textures: Listx = null;

    public static GetTextures(texture: egret.Texture, path: string = ""): Textures {
        let hash = texture.hashCode.toString();
        if (path.IsFull()) {
            if (Textures.textures == null) {
                Textures.textures = new Listx();
                NForm.SetInterval(60 * 1000, () => {
                    Textures.GC();
                });
            }
            if (!Textures.textures.Exists(path)) {
                Textures.textures[path] = new Listx();
            }
            let arr: Listx = Textures.textures[path];
            arr["gc"] = 0;
            if (arr.Exists(hash)) {
                return arr[hash];
            }
            let t = new Textures(texture, path);
            arr[hash] = t;
            return t;
        } else {
            if (Textures.texturesStatic.Exists(hash)) {
                return Textures.texturesStatic[hash];
            }
            let t = new Textures(texture, path);
            Textures.texturesStatic[hash] = t;
            return t;
        }
    }

    public static GC(): void {
        let gced = false;
        try {
            if (Textures.textures) {
                Textures.textures.EachKey((path) => {
                    if (Src.inreadingDataCacheList.Exists(path)) {
                        return;
                    }
                    let list: Listx = Textures.textures[path];
                    let nouse: boolean = true;
                    list.EachKey((hash) => {
                        if (hash == "gc") {
                        } else {
                            if (list[hash].tick > 0) {
                                nouse = false;
                                return true;
                            }
                        }
                    });
                    if (nouse) {
                        list["gc"]++;
                    }
                    if (list["gc"] >= 2) {
                        Textures.DoGC(path);
                        gced = true;
                    }
                });
            }
            if (gced) {
                Msg.Call("GC", null);
            }
        } catch (ex) {
            Js.Trace(ex);
        }
    }

    public static DoGC(path: string): void {
        if (Src.inreadingDataCacheList.Exists(path)) {
            return;
        }
        Js.Trace("GC:" + path);
        let list: Listx = Textures.textures[path];
        list.EachKey((hash) => {
            if (hash == "gc") {
            } else {
                let textures: Textures = list[hash];
                textures.Dispose();
            }
        });
        list.Clear();
        Textures.textures.Remove(path);
        Src.dataCacheList.Remove(path);
    }
}

window["Textures"] = Textures;