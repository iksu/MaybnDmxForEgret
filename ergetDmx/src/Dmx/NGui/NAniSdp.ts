//sdp格式解析的动画库
class NAniSdp extends Sx {
    public ani: Sx;
    public overAndRemove: boolean;
    public playEndFunc: Function;
    public actList: Listx;
    public totalFrame: number = 0;
    public frames = [];

    public skeletonTrees;
    public skeletonActions;
    public skeletonSkins;

    public actPath;

    public constructor(resPath: any, actPath: string, loaded: Function = null, overAndRemove: boolean = true, frameRate: number = 12) {
        super();
        this.overAndRemove = overAndRemove;
        this.actPath = actPath;

        NAniXml.Load(resPath, (actList) => {
            NForm.LazyCall(() => {
                if (actList == null) {
                    return;
                }
                this.actList = actList;
                this.LoadAct(actPath);
            });
        }, false);
    }

    public LoadAct(actPath: string, loaded: Function = null, overAndRemove: boolean = true, frameRate: number = 12) {
        if (this.disposed) {
            return;
        }
        Src.ReadTxt(Config.icoPath + actPath + ".xml", ((data) => {
            if (this.disposed) {
                return;
            }
            if (data == null || data.length == 0) {
                return;
            }
            this.frameRate = frameRate;
            let xml = new Xml(data);
            let nodes = xml.nodes;
            //Js.Trace(nodes);
            this.skeletonTrees = [];
            this.skeletonActions = [];
            this.skeletonSkins = [];
            nodes.forEach((fi) => {
                if (fi.type == "SkeletonTree") {
                    this.skeletonTrees.push(fi);
                } else if (fi.type == "SkeletonAction") {
                    this.skeletonActions.push(fi);
                } else if (fi.type == "SkeletonSkin") {
                    this.skeletonSkins.push(fi);
                }
            });
            this.skeletonActions = this.skeletonActions.sort((a1, a2) => {
                return a1.Tag.ToInt() - a2.Tag.ToInt();
            });
            this.skeletonSkins = this.skeletonSkins.sort((a1, a2) => {
                return a1.Tag.ToInt() - a2.Tag.ToInt();
            });
            this.totalFrame = this.skeletonActions[0].TotalFrame;

            this.frameRate = frameRate;

            this.ani = new Sx();
            this.Add(this.ani);

            this.TimerHandle();
            if (loaded) {
                loaded();
            }

        }));
    }

    public Play(name: string, playEndFunc: Function = null) {
        if (this.ani) {
            if (name.IsEmpty()) {
                if (this.actList.length > 0) {
                    name = this.actList.GetName(0);
                }
            }
            this.name = name;
            this._frame = 0;
            this.playEndFunc = playEndFunc;
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
            if (this.disposed) {
                return true;
            }
            if (_timerHandleIndex1 != this._timerHandleIndex) {
                return true;
            }
            if (!this._stop) {
                if (this.totalFrame > 0) {
                    if (this._frame >= this.totalFrame) {
                        if (this.playEndFunc) {
                            this.playEndFunc();
                            this.playEndFunc = null;
                        }
                        if (this.overAndRemove) {
                            this.Dispose();
                            return true;
                        }
                        if (this._stopAtEnd) {
                            this.Stop();
                        }
                        this._frame = 0;
                        for (let i = 0, len = this.skeletonSkins.length; i < len; i++) {
                            let skeletonSkin = this.skeletonSkins[i];
                            skeletonSkin.img = "";
                            if (skeletonSkin.bx) {
                                skeletonSkin.bx.RemoveMe();
                                skeletonSkin.bx = null;
                            }
                        }
                    }

                    for (let i = 0, len = this.skeletonSkins.length; i < len; i++) {
                        let skeletonSkin = this.skeletonSkins[i];
                        if (skeletonSkin.oxs) {
                            for (let j = 0, lenj = skeletonSkin.oxs.length; j < lenj; j++) {
                                let fi = skeletonSkin.oxs[j];
                                if (this._frame == fi.Frame.ToInt()) {
                                    if (skeletonSkin.img != fi.Name) {
                                        skeletonSkin.img = fi.Name;
                                        if (skeletonSkin.bx) {
                                            skeletonSkin.bx.RemoveMe();
                                        }
                                        if (this.actList.length == 0) {
                                            let bx = Assert.Img(Config.icoPath + this.actPath.substr(0, this.actPath.lastIndexOf("/")) + "/" + skeletonSkin.img);
                                            this.ani.Add(bx);
                                            skeletonSkin.bx = bx;
                                        }
                                        else if (this.actList[skeletonSkin.img]) {
                                            let bx = new Bx(this.actList[skeletonSkin.img][0].texture);
                                            this.ani.Add(bx);
                                            skeletonSkin.bx = bx;
                                        } else {
                                            if (!skeletonSkin.first) {
                                                Js.Trace("Mis Img: " + skeletonSkin.img);
                                                skeletonSkin.first = true;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        let skeletonAction = this.skeletonActions[i];
                        //Js.Trace(skeletonSkin.Tag + ":" + skeletonAction.Tag);
                        if (skeletonAction.oxs) {
                            let nextData = false;
                            for (let j = 0, lenj = skeletonAction.oxs.length; j < lenj; j++) {
                                let fi = skeletonAction.oxs[j];
                                if (this._frame == fi.Frame.ToInt()) {
                                    skeletonAction.data = fi;
                                    nextData = true;
                                }
                                if (nextData) {
                                    skeletonAction.nextData = fi;
                                    break;
                                }
                            }
                            if (skeletonSkin.bx && skeletonAction.data) {
                                skeletonSkin.bx.OnLoaded(() => {
                                    skeletonSkin.bx.anchorOffsetX = skeletonSkin.bx.width * parseFloat(skeletonAction.AnchorX);
                                    skeletonSkin.bx.anchorOffsetY = skeletonSkin.bx.height * parseFloat(skeletonAction.AnchorY);

                                    skeletonSkin.bx.x = -this.GetFrameVal(skeletonAction.data, skeletonAction.nextData, "PosX");
                                    skeletonSkin.bx.y = -this.GetFrameVal(skeletonAction.data, skeletonAction.nextData, "PosY");

                                    skeletonSkin.bx.scaleX = this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "ScaleX");
                                    skeletonSkin.bx.scaleY = this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "ScaleY");

                                    skeletonSkin.bx.skewX = this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "SkewX");
                                    skeletonSkin.bx.skewY = this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "SkewY");

                                    skeletonSkin.bx.alpha = this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "Opacity") / 255;
                                    skeletonSkin.bx.rotation = this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "Rot")
                                    if (skeletonAction.data.Visible == "1") {
                                        skeletonSkin.bx.Show();
                                    } else {
                                        skeletonSkin.bx.Hide();
                                    }
                                    //TODO:Color

                                });
                            }
                        }
                    }

                    this._frame++;
                }
            }
            return false;
        });
    }

    public GetFrameVal(data1: any, data2: any, key: string): number {
        return parseFloat(data1[key]);
    }

    public GetFrameValTween(data1: any, data2: any, key: string): number {
        if (!data2) {
            return parseFloat(data1[key]);
        }
        if (data1.Frame == data1.Frame) {
            return parseFloat(data1[key]);
        }
        return (parseFloat(data2[key]) - parseFloat(data1[key])) * (this._frame - data1.Frame) / (data2.Frame - data1.Frame) + parseFloat(data1[key]);
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
}

window["NAniSdp"] = NAniSdp;