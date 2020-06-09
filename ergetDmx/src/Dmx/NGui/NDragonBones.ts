//龙骨类，如果需要的话将该类直接放到解除注释，拷贝到游戏中
//需要引用白鹭龙骨底层
// class NDragonBones extends Sx {
//     private factory: dragonBones.EgretFactory;
//     public ani: dragonBones.EgretArmatureDisplay;
//     public playTimes: number;
//     public overAndRemove: boolean;
//     public playEndFunc: Function;
//     public texture: any;
//     //public movieData: egret.MovieClipData

//     public constructor(path: string, icoName: string, loaded: Function = null, overAndRemove: boolean = true, frameRate: number = 6) {
//         super();
//         this.overAndRemove = overAndRemove;
//         this.playTimes = 0;

//         if (!Js.SupportWebGL) {
//             let img = Assert.Img(Config.icoPath + path.replace("db", "db1") + ".png");
//             this.Add(img);
//             img.OnLoaded(() => {
//                 img.x = -img.width / 2;
//                 img.y = -img.height * 6 / 7;
//                 if (loaded) {
//                     loaded();
//                 }
//             });
//             return;
//         }
//         if (icoName == null || icoName.IsEmpty()) {
//             icoName = path;
//         }
//         Src.ReadTxt(Config.icoPath + path + "_ske.json", ((dragonbonesData) => {
//             Src.ReadTxt(Config.icoPath + path + "_tex.json", ((textureData) => {
//                 let texturePath = Config.icoPath + icoName + "_tex.png";
//                 Src.Read(texturePath, ((texture) => {
//                     this.texture = texture;
//                     // Js.Trace(dragonbonesData);
//                     // Js.Trace(textureData);
//                     // Js.Trace(texture);

//                     if (!textureData || texture == null) {
//                         return;
//                     }
//                     // try {
//                     //     dragonbonesData = Strx.Decompress(new Uint8Array(dragonbonesData));
//                     //     dragonbonesData = UTF8.decode(dragonbonesData);
//                     // } catch (ex) {
//                     //     Js.Trace(dragonbonesData);
//                     // }
//                     if (!dragonbonesData) {
//                         return;
//                     }
//                     if (!this.disposed) {
//                         let aniName: string = path.split("/")[1];
//                         //this.factory = dragonBones.EgretFactory.factory;
//                         this.factory = new dragonBones.EgretFactory();

//                         this.factory.parseDragonBonesData(JSON.parse(dragonbonesData));
//                         this.texture.Keep();
//                         this.factory.parseTextureAtlasData(JSON.parse(textureData), texture.texture, null, 1);//texture居然需要texture.texture了


//                         this.ani = this.factory.buildArmatureDisplay(aniName);
//                         this.Add(this.ani);

//                         this.frameRate = frameRate;
//                         if (this.autoDispose || this.playTimes > 0) {
//                             this.ani.once(egret.Event.COMPLETE, this.End, this);
//                         }
//                         let hasFrame: boolean = false;

//                         // this.ani.animation.animationNames.forEach((fi) => {
//                         //     if (fi == name) {
//                         //         hasFrame = true;
//                         //     }
//                         // });
//                         // if (!hasFrame) {
//                         //     name = this.ani.animation.animationNames[0];
//                         // }
//                         this.Play("");
//                         if (loaded) {
//                             loaded();
//                         }
//                         if (this._frameRate > 0) {
//                             this.frameRate = this._frameRate;
//                         }
//                     }
//                 }).bind(this));
//             }).bind(this));
//         }).bind(this));

//         this.mouseEnabled = false;
//         this.mouseChildren = false;
//     }

//     public static LoadSrc(path: string, func: Function) {
//         if (!Js.SupportWebGL) {
//             Src.Read(Config.icoPath + path.replace("db", "db1") + ".png", (texture) => {
//                 func();
//             });
//         } else {
//             Src.ReadByte(Config.icoPath + path + "_ske.json.txt", (dragonbonesData) => {
//                 Src.ReadTxt(Config.icoPath + path + "_tex.json", (textureData) => {
//                     Src.Read(Config.icoPath + path + "_tex.png", (texture) => {
//                         func();
//                     });
//                 });
//             });
//         }
//     }

//     ///这个回调并不可靠
//     public actName: string;
//     public Play(name: string, playEndFunc: Function = null) {
//         if (this.ani) {
//             if (name.IsEmpty()) {
//                 name = this.ani.animation.animationNames[0]
//             }
//             if (this.actName == name) {
//                 return;
//             }
//             this.actName = name;
//             this.playEndFunc = playEndFunc;
//             if (playEndFunc) {
//                 this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.PlayOnEnd, this);
//                 this.ani.once(egret.Event.LOOP_COMPLETE, this.PlayOnEnd, this);
//             }
//             if (this.overAndRemove) {
//                 this.ani.animation.play(name, 1);
//             }
//             else if (this.playTimes > 0) {
//                 this.ani.animation.play(name, this.playTimes);
//             }
//             else {
//                 this.ani.animation.play(name, 0);
//             }
//         }
//     }

//     public Stop() {
//         if (this.ani) {
//             this.ani.animation.stop();
//         }
//     }

//     public StopAtEnd() {
//         this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
//         this.ani.once(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
//     }

//     private StopAtEndWhenPlayOnEnd() {
//         if (this.ani) {
//             this.ani.animation.stop();
//         }
//         this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
//     }

//     public Continue() {
//         if (this.ani) {
//             this.ani.animation.play();
//         }
//     }

//     private End(ev) {
//         if (this.overAndRemove) {
//             this.Dispose();
//         }
//     }

//     private PlayOnEnd(ev) {
//         if (this.playEndFunc) {
//             this.playEndFunc();
//         }
//     }

//     private _frameRate: number = 1;

//     ///百分比
//     public get frameRate(): number {
//         if (this.ani == null) {
//             return 0;
//         }
//         return this.ani.animation.timeScale;
//     }

//     ///百分比
//     public set frameRate(val: number) {
//         if (this.ani == null) {
//             return;
//         }
//         this._frameRate = val;
//         this.ani.animation.timeScale = val;
//     }

//     public Dispose() {
//         if (!this.disposed) {
//             if (this.ani) {
//                 this.ani.animation.stop();
//                 this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.PlayOnEnd, this);
//                 this.ani.removeEventListener(egret.Event.COMPLETE, this.End, this);
//                 this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
//                 this.ani.dispose();
//             }
//         }
//         try {
//             if (this.texture) {
//                 this.texture.Release();
//             }
//         } catch (ex) { }
//         this.factory = null;
//         this.ani = null;
//         super.Dispose();
//     }
// }