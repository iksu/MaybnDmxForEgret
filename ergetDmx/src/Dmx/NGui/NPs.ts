class NPs extends Sx {
    //private factory: egret.MovieClipDataFactory;
    //public ani: egret.MovieClip;
    //public playTimes: number;
    //public overAndRemove: boolean;
    //public playEndFunc: Function;
    //public movieData: egret.MovieClipData

    public constructor(path: string) {
        super();
        //particle.
        // var system: particle.ParticleSystem;
        // var texture = RES.getRes("star");//粒子图片，这里选择星星
        // var config = RES.getRes("fire_json");//粒子对应的json配置文件，这里选择火焰
        // system = new particle.GravityParticleSystem(texture, config);
        // system.emitterX = 200;
        // system.emitterY = 200;

        // this.addChild(system);
        //system.start();
        
    }

    public Play(name: string, playEndFunc: Function = null) {

    }

    public Stop() {
        // if (this.ani) {
        //     this.ani.stop();
        // }
    }

    public StopAtEnd() {
        // this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
        // this.ani.addEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
    }

    private StopAtEndWhenPlayOnEnd() {
        // if (this.ani) {
        //     this.ani.gotoAndStop(this.ani.totalFrames - 1);
        // }
        // this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
    }

    public Continue() {
        // if (this.ani) {
        //     this.ani.play();
        // }
    }

    private End(ev) {
        // if (this.overAndRemove) {
        //     this.Dispose();
        // }
    }

    private PlayOnEnd(ev) {
        // if (this.playEndFunc) {
        //     this.playEndFunc();
        // }
    }

    // private _frameRate: number = -1;

    // public get frameRate(): number {
    //     if (this.ani == null) {
    //         return 0;
    //     }
    //     return this.ani.frameRate;
    // }

    // public set frameRate(val: number) {
    //     if (this.ani == null) {
    //         return;
    //     }
    //     this._frameRate = val;
    //     this.ani.frameRate = val;
    // }

    public Dispose() {
        if (!this.disposed) {
            // this.ani.stop();
            // this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.PlayOnEnd, this);
            // this.ani.removeEventListener(egret.Event.COMPLETE, this.End, this);
            // this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
            // this.ani.movieClipData = null;
        }
        //this.movieData = null;
        super.Dispose();
    }
}

window["NPs"] = NPs;