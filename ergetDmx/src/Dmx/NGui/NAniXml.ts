class NAniXml extends Sx {
    public ani: Bx;
    public path: string;
    public overAndRemove: boolean;
    public playEndFunc: Function;
    public playEndFunc2: Function;
    public actList: Listx;
    public info: any;
    public static getNameFunc: Function;
    public static getIndexFunc: Function;

    public constructor(path: string, name: string, overAndRemove: boolean = true, frameRate: number = 12) {
        super();
        this.overAndRemove = overAndRemove;
        this.path = path;
        NAniXml.Load(path, (actList) => {
            NForm.LazyCall(() => {
                if (actList == null) {
                    Js.Trace("NAniXml actList null: " + path)
                    this.RemoveMe();
                    this.Dispose();
                    return;
                }
                if (this.disposed) {
                    return;
                }
                try {
                    this.actList = actList;
                    this.frameRate = frameRate;
                    this.ani = new Bx(null);
                    this.info = this.actList.GetValue(0)[0];
                    if (this.info) {
                        this.info.texture.Keep();
                    }
                    this.Add(this.ani);
                    this.Play(name);
                    this.TimerHandle();
                } catch (ex) {
                    Js.Trace(ex);
                }
                if (this.loadedFuncList) {
                    this.loadedFuncList.Each((fi) => {
                        fi();
                    });
                }
                // if (this._frameRate > 0) {
                //     this.frameRate = this._frameRate;
                // }
            });
        });
    }

    public static oneActList: Listx;
    public static LoadOne(path: string, actList: Listx, fullImg: boolean = true, func: Function) {
        if (NAniXml.oneActList == null) {
            NAniXml.oneActList = new Listx();
        }
        if (NAniXml.oneActList.Exists(path)) {
            try {
                let list = NAniXml.oneActList[path];
                if (!list.GetValue(0)[0].texture.disposed) {
                    NForm.LazyCall(() => {
                        func(list);
                    });
                    return;
                }
            } catch (ex) {
                Js.Trace(ex);
            }
        }
        Src.ReadTxt(Config.icoPath + path + ".xml", ((data) => {
            Src.Read(Config.icoPath + path + ".png", ((textures: Textures) => {
                //Js.Trace(textures);
                NForm.LazyCall(() => {
                    if (NAniXml.oneActList.Exists(path)) {
                        try {
                            let list = NAniXml.oneActList[path];
                            if (!list.GetValue(0)[0].texture.disposed) {
                                func(list);
                                return;
                            }
                        } catch (ex) {
                            Js.Trace(ex);
                        }
                    }
                    if (data == null || data.length == 0 || textures == null) {
                        func(null);
                        return;
                    }
                    Js.Trace(path);
                    // data = data.replace(/TextureAtlas/g, "root");
                    // data = data.replace(/SubTexture/g, "ox");
                    let xml = new Xml(data);
                    let index = 0;
                    xml.nodes.forEach((fi: any) => {
                        let act = fi.name;
                        let names = fi.name.split("_");
                        index++;
                        ////////////////////////////////////
                        if (NAniXml.getNameFunc) {
                            act = NAniXml.getNameFunc(names, path);
                        } else {
                            act = path.split("/")[1];
                        }
                        if (NAniXml.getIndexFunc) {
                            index = NAniXml.getIndexFunc(names, path);
                        }
                        ////////////////////////////////////
                        fi.index = index;
                        if (!actList.Exists(act)) {
                            actList[act] = [];
                        }
                        actList[act].push(fi);
                        let t = new egret.Texture();
                        t.$bitmapData = textures.bitmapData;
                        if (fullImg) {
                            if (typeof fi.frameX == "undefined") {
                                fi.frameX = 0;
                            }
                            if (typeof fi.frameY == "undefined") {
                                fi.frameY = 0;
                            }
                            if (fi.sourceWidth) {
                                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.sourceWidth, fi.sourceHeight, textures.bitmapWidth, textures.bitmapHeight, fi.rotated);
                            } else if (fi.frameWidth) {
                                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.frameWidth, fi.frameHeight, textures.bitmapWidth, textures.bitmapHeight, fi.rotated);
                            } else {
                                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.width, fi.height, textures.bitmapWidth, textures.bitmapHeight, fi.rotated);
                            }
                        } else {
                            t.$initData(fi.x, fi.y, fi.width, fi.height, 0, 0, fi.width, fi.height, textures.bitmapWidth, textures.bitmapHeight, fi.rotated);
                        }
                        fi.texture = Textures.GetTextures(t, textures.path);
                    });
                    actList.EachKey((key) => {
                        actList[key] = actList[key].sort((a1, a2) => {
                            return a1.index - a2.index;
                        });
                    });
                    NAniXml.oneActList[path] = actList;
                    func(actList);
                });
            }));
        }));
    }

    public static Load(path: any, func: Function, fullImg: boolean = true, actList: Listx = null) {
        if (actList == null) {
            actList = new Listx();
        }
        if (path == -1) {
            if (func) {
                func(actList);
            }
        } else {
            var paths = null;
            if (typeof path == "string") {
                paths = [];
                paths.push(path);
            } else {
                paths = path;
            }
            if (paths.length == 0) {
                if (func) {
                    func(actList);
                }
            } else {
                let p = paths.splice(0, 1)[0];
                NAniXml.LoadOne(p, actList, fullImg, (res) => {
                    NAniXml.Load(paths, func, fullImg, res);
                });
            }
        }
    }

    public Play(name: string, playEndFunc: Function = null) {
        if (this.ani) {
            this.name = name;
            this._frame = 0;
            if (playEndFunc) {
                this.playEndFunc = playEndFunc;
            }
        }
    }

    public _stop: boolean = false;
    public _stopAtEnd: boolean = false;
    public _timerHandleIndex: number = 0;
    public _frame: number = 0;
    public TimerHandle() {
        if (!this.ani) {
            return;
        }
        this._timerHandleIndex++;
        let _timerHandleIndex1 = this._timerHandleIndex;
        NForm.SetInterval(1000 / this.frameRate, () => {
            let path = this.path;
            if (this.disposed) {
                return true;
            }
            if (_timerHandleIndex1 != this._timerHandleIndex) {
                return true;
            }
            if (!this.topVisible) {
                return;
            }
            if (!this._stop || this.ani.$bitmapData == null) {
                if (this.name.IsFull()) {
                    let arr = this.actList[this.name];
                    if (arr == null || arr.length == 0) {// || arr.length == 1
                        if (Js.showTrace) {
                            throw new Error("Error nanixml: " + this.path + " name:" + this.name);
                        }
                    }
                    if (arr && arr.length > 0) {
                        if (this._frame >= arr.length) {
                            if (this.playEndFunc) {
                                this.playEndFunc();
                                this.playEndFunc = null;
                            }
                            if (this.playEndFunc2) {
                                this.playEndFunc2();
                                this.playEndFunc2 = null;
                            }
                            if (this.overAndRemove) {
                                this.Dispose();
                                return true;
                            }
                            if (this._stopAtEnd) {
                                this.Stop();
                            }
                            this._frame = 0;
                        }
                        if (this.ani) {
                            this.ani.SetBitmap(arr[this._frame].texture);
                        }
                        this._frame++;
                    }
                } else {
                    let arr = this.actList;
                    if (arr == null || arr.length == 0 || arr.length == 1) {
                        if (Js.showTrace) {
                            throw new Error("Error nanixml: " + this.path + " name:" + this.name);
                        }
                    }
                    if (arr && arr.length > 0) {
                        if (this._frame >= arr.length) {
                            if (this.playEndFunc) {
                                this.playEndFunc();
                                this.playEndFunc = null;
                            }
                            if (this.playEndFunc2) {
                                this.playEndFunc2();
                                this.playEndFunc2 = null;
                            }
                            if (this.overAndRemove) {
                                this.Dispose();
                                return true;
                            }
                            if (this._stopAtEnd) {
                                this.Stop();
                            }
                            this._frame = 0;
                        }
                        this.ani.SetBitmap(arr.GetValue(this._frame)[0].texture);
                        //Js.Trace(this.ani.width);
                        this._frame++;
                    }
                }
            }
            return false;
        });
    }

    public get width() {
        if (this.info) {
            return this.info.frameWidth;
        }
        return 0;
    }

    public get height() {
        if (this.info) {
            return this.info.frameHeight;
        }
        return 0;
    }

    public StopAtEnd() {
        this._stopAtEnd = true;
    }

    public Stop() {
        this._stop = true;
    }

    public Continue() {
        this._stop = false;
    }

    private End(ev) {
        if (this.overAndRemove) {
            this.Dispose();
        }
    }

    private _frameRate: number = 12;

    public get frameRate(): number {
        return this._frameRate;
    }

    public set frameRate(val: number) {
        if (val <= 0) {
            val = 12;
        }
        if (this._frameRate != val) {
            this._frameRate = val;
            this.TimerHandle();
        }
    }

    public loadedFuncList: Arr<Function>;
    public OnLoaded(func: Function): void {
        if (this.loadedFuncList == null) {
            this.loadedFuncList = new Arr<Function>();
        }
        this.loadedFuncList.Add(func);
    }

    public Dispose() {
        this.playEndFunc = null;
        this.playEndFunc2 = null;
        this.actList = null;
        if (this.info) {
            this.info.texture.Release();
        }
        this.info = null;
        this.ani = null;
        super.Dispose();
    }
}

window["NAniXml"] = NAniXml;