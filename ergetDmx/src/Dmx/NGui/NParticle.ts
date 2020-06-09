//粒子类，如果需要的话将该类直接放到解除注释，拷贝到游戏中
//需要引用白鹭粒子底层
// class NParticle extends Sx {
//     public ani: particle.GravityParticleSystem;
//     public playTimes: number;
//     public overAndRemove: boolean;
//     public playEndFunc: Function;

//     public constructor(path: string, loaded: Function = null, overAndRemove: boolean = true, frameRate: number = 6) {
//         super();

//         this.overAndRemove = overAndRemove;
//         this.playTimes = 0;

//         if (!Js.SupportWebGL) {
//             return;
//         }

//         Src.ReadTxt(Config.icoPath + path + ".json", ((textureData) => {
//             Src.Read(Config.icoPath + path + ".png", ((texture) => {
//                 // Js.Trace(textureData);
//                 //Js.Trace(texture);

//                 if (textureData.IsEmpty() || texture == null) {
//                     return;
//                 }
//                 if (!this.disposed) {
//                     try {
//                         this.ani = new particle.GravityParticleSystem(texture, JSON.parse(textureData));
//                         //egret.ass
//                         // if (!this.ani["$waNode"]) {
//                         //     this.ani["createWebAssemblyNode"]();
//                         // }
//                         //this.ani.texture = texture;
//                         this.ani.emitterX = 0;
//                         this.ani.emitterY = 0;
//                         this.Add(this.ani);

//                         // this.frameRate = frameRate;
//                         // if (this.autoDispose || this.playTimes > 0) {
//                         //     this.ani.addEventListener(egret.Event.COMPLETE, this.End, this);
//                         // }

//                         this.ani.start();
//                         //this.Play();
//                         if (loaded) {
//                             loaded();
//                         }
//                         this.mouseEnabled = false;
//                         this.mouseChildren = false;
//                         // if (this._frameRate > 0) {
//                         //     this.frameRate = this._frameRate;
//                         // }
//                     } catch (ex) {
//                         Js.Trace(ex);
//                     }
//                 }
//             }).bind(this));
//         }).bind(this));

//         this.mouseEnabled = false;
//         this.mouseChildren = false;
//     }

//     public static LoadSrc(path: string, func: Function) {
//         if (!Js.SupportWebGL) {
//             func();
//             return;
//         }
//         Src.ReadTxt(Config.icoPath + path + ".json", ((textureData) => {
//             Src.Read(Config.icoPath + path + ".png", ((texture) => {
//                 func();
//             }));
//         }));
//     }

//     public Play(playEndFunc: Function = null) {
//         if (this.ani) {
//             this.playEndFunc = playEndFunc;
//             if (playEndFunc) {
//                 this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.PlayOnEnd, this);
//                 this.ani.once(egret.Event.LOOP_COMPLETE, this.PlayOnEnd, this);
//             }
//             if (this.overAndRemove) {
//                 this.ani.start(1);
//             }
//             else if (this.playTimes > 0) {
//                 this.ani.start(this.playTimes);
//             }
//             else {
//                 this.ani.start();
//             }
//         }
//     }

//     public Stop() {
//         if (this.ani) {
//             this.ani.stop(false);
//         }
//     }

//     public StopAtEnd() {
//         this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
//         this.ani.once(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
//     }

//     private StopAtEndWhenPlayOnEnd() {
//         if (this.ani) {
//             this.ani.stop(false);
//         }
//         this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
//     }

//     public Continue() {
//         if (this.ani) {
//             this.ani.start();
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
//         return this.ani.emissionRate;
//     }

//     ///百分比
//     public set frameRate(val: number) {
//         if (this.ani == null) {
//             return;
//         }
//         this._frameRate = val;
//         this.ani.emissionRate = val;
//     }

//     public Dispose() {
//         if (!this.disposed) {
//             if (this.ani) {
//                 this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.PlayOnEnd, this);
//                 this.ani.removeEventListener(egret.Event.COMPLETE, this.End, this);
//                 this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
//                 this.ani.stop(true);
//             }
//         }
//         this.ani = null;
//         super.Dispose();
//     }
// }