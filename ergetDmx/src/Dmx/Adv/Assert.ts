class Assert {
    public static assertList = new Listx();
    public static aniAssertList = new Listx();

    public static classes = new Arr<string>();
    public static classes1 = new Arr<string>();
    public static finished: boolean = false;

    private static index: number = -1;
    public static process: Function;
    public static loaded: Function;

    public static Load(process: Function, loaded: Function): void {
        if (Assert.finished) {
            loaded();
            return;
        }
        Assert.process = process;
        Assert.loaded = loaded;

        let preload: string[] = RES["config"]["config"]["groups"]["preload"];
        preload.forEach((fi) => {
            var fis = fi.split("_");
            if (fis.length > 1) {
                if (fis[1] == "png" || fis[1] == "jpg") {
                    Assert.assertList[fi] = RES.getRes(fi);
                } else if (fis[1] == "xml") {
                    Assert.classes.Add(fis[0]);
                }
            }
        });

        Assert.Next();
    }

    private static Next() {
        Assert.index++;
        if (Assert.classes.length > Assert.index) {
            var atlasName = Assert.classes.getItemAt(Assert.index);
            //NForm.SetTimeout(100, () => {
            Assert.Process(atlasName, Assert.Next);
            //});
        } else {
            if (Assert.loaded) {
                Assert.loaded();
                Assert.loaded = null;
            }
            Assert.process = null;
            Assert.classes.Clear();
            Assert.classes = null;
            Assert.index = -1;
            Assert.Next1();
        }
    }

    private static Next1() {
        Assert.index++;
        if (Assert.classes1 && Assert.classes1.Length > Assert.index) {
            var atlasName = Assert.classes1.getItemAt(Assert.index);
            NForm.SetTimeout(100, () => {
                Assert.Process(atlasName, Assert.Next1);
            });
            //////////
        }
        else {
            if (Assert.loaded) {
                Assert.loaded();
                Assert.loaded = null;
            }
            Assert.process = null;
            Assert.classes1.Clear();
            Assert.classes1 = null;
            Assert.finished = true;
        }
    }

    private static processAtlasName = "";
    private static Process(atlasName: any, nextFunc: Function): void {
        Assert.processAtlasName = atlasName;
        if (Assert.process) {
            Assert.process(atlasName, 0, 1);
        }

        Js.Trace("Load Atlas:" + atlasName);

        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        let textures: egret.Texture = RES.getRes(atlasName + "_png");
        //Js.Trace(textures);
        let data: string = RES.getRes(atlasName + "_xml");

        //data = data.replace(/TextureAtlas/g, "root");
        //data = data.replace(/SubTexture/g, "ox");
        let xml = new Xml(data);
        xml.nodes.forEach((fi: any) => {
            ////////////////////////////////////
            let t = new egret.Texture();
            t.$bitmapData = textures.$bitmapData;
            //if (fullImg) {
            if (typeof fi.frameX == "undefined") {
                fi.frameX = 0;
            }
            if (typeof fi.frameY == "undefined") {
                fi.frameY = 0;
            }
            if (fi.sourceWidth) {
                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.sourceWidth, fi.sourceHeight, textures.textureWidth, textures.textureHeight, fi.rotated);
            } else if (fi.frameWidth) {
                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.frameWidth, fi.frameHeight, textures.textureWidth, textures.textureHeight, fi.rotated);
            } else {
                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.width, fi.height, textures.textureWidth, textures.textureHeight, fi.rotated);
            }
            // } else {
            //     t.$initData(fi.x, fi.y, fi.width, fi.height, 0, 0, fi.width, fi.height, textures.textureWidth, textures.textureHeight, fi.rotated);
            // }
            let texture = t;
            if (Assert.assertList.Exists(fi.name)) {
                Js.Trace("Exists Texture:" + fi.name);
            }
            if (fi.name.indexOf("_") > -1) {
                Assert.aniAssertList[fi.name] = texture;
            }
            Assert.assertList[fi.name] = texture;
        });
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        if (nextFunc) {
            nextFunc();
        }
    }

    public static Img(name: string): Bx {
        if (name.indexOf(".") > -1) {
            if (name.StartWith("http")) {
                let bx = new NSprite(name, -1, -1);
                return bx;
            }
            else if (name.indexOf("/") == -1) {
                let bx = new NSprite(Config.src + "ui/" + name, -1, -1);
                return bx;
            } else {
                if (name.indexOf("lang") > -1) {
                    let bx = new NSprite(Config.src + name.replace("lang", "lang/" + Lang.type), -1, -1);
                    return bx;
                } else {
                    var bx = new NSprite(Config.src + name, -1, -1);
                    return bx;
                }
            }
        } else {
            if (name.indexOf("/") > -1) {
                var bx = new Sp(name.split("/")[1]);
                return bx;
            } else {
                var bx = new Sp(name);
                // if (loaded) {
                //     Form.LazyCall(() => {
                //         loaded();
                //     });
                // }
                return bx;
            }
        }
    }

    public static Trace(): void {
        if (Assert.process) {
        }
    }
}

window["Assert"] = Assert;
