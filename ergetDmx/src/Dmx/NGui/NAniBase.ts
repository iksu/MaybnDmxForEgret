class NAniBase extends Sx {
    private overAndRemove: boolean;
    private arr: Arr<any>;
    public img: Bx = null;
    public enterFrame: Function;
    public enterFrame1: Function;
    //private IImg sp0;
    public endAct: Function;
    public stopAtEnd: boolean = false;

    public constructor(overAndRemove: boolean = true) {
        super();
        this.overAndRemove = overAndRemove;
    }

    private load: boolean = false;
    public Load(arr: Arr<any>) {
        if (arr == null || arr.Count == 0) {
            return;
        }
        this.arr = arr;
        if (!this.load) {
            if (Strx.IsString(arr.getItemAt(0))) {
                this.img = new Bx(arr.getItemAt(0));
                this.Add(this.img);
            }
            else {
                this.img = arr.getItemAt(0);
                if (<any>this.img != <any>this) {
                    this.Add(this.img);
                }
            }
        }

        this.times = 0;
        this.frameCount = arr.Count;

        if (!this.load) {
            if (arr.Count > 1) {
                NForm.LazyCall(() => {
                    this.TimerHandle();
                });
            }
            if (!this.disposed) {
                NForm.LazyCall(() => {
                    if (!this.disposed) {
                        this.CallLoad();
                    }
                });
            }
        }
        this.load = true;
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

    public _stop: boolean = false;
    public _stopAtEnd: boolean = false;
    public _timerHandleIndex: number = 0;
    private TimerHandle() {
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
                this.TimerHandler();
            }
            return false;
        });
    }

    private origLateFrameList: any;
    private lateFrameList: any;
    public LateFrame(per: number = 75, lateCount: number = 2) {
        //origLateFrameList = new Tuplex<int, int>(per, lateCount);
        //lateFrameList = new Tuplex<int, int>(per, lateCount);
    }
    public ClearLateFrame() {
        this.lateFrameList = null;
    }

    public times: number;
    private addTime: number = 1;
    private frameCount: number;
    private stoped: boolean = false;
    private stopFrame: number = -1;
    private frames: any

    public Stop(frame = -1) {
        this.stoped = true;
        if (frame < 0) {
            frame = this.times;
        }
        this.times = frame;
        if (this.img && this.arr) {
            //this.img.SetData(this.arr[frame]);//由上进行处理
        }
    }

    public Play(frame: number = -1) {
        this.stoped = false;
        if (frame >= 0) {
            this.times = frame;
        }
        this.stopFrame = -1;
    }

    public PlayFrames(frames: any, stopFrame: number = -1) {
        this.stoped = false;
        if (frames.Count == 0) {
            frames = null;
        }
        this.frames = frames;
        this.stopFrame = stopFrame;
        if (frames) {
            this.times = 0;
        }
    }

    public TimerHandler(): boolean {
        if (this.disposed) {
            return true;
        }
        if (this.stoped) {
            return false;
        }
        if (this.topVisible) {
            if (this.frames == null) {
                if (this.lateFrameList && this.lateFrameList.Item2 > 0) {
                    if (this.times * 100 / this.arr.Count >= this.lateFrameList.Item1) {
                        this.lateFrameList.Item2--;
                        return false;
                    }
                }
                if (this.times < this.arr.Count) {
                    if (this.img) {
                        //this.img.SetData(this.arr[this.times]);//由上进行处理
                    }
                    if (this.enterFrame) {
                        this.enterFrame(this.times, this);
                    }
                    if (this.enterFrame1) {
                        this.enterFrame1(this.times, this);
                    }
                }
                if (this.times == this.stopFrame) {
                    this.Stop();
                    return false;
                }
                this.times += this.addTime;
                if (this.times >= this.frameCount) {
                    if (this.endAct) {
                        this.endAct();
                    }
                }
                if (this.times >= this.frameCount) {
                    if (this.stopAtEnd) {
                        this.Stop(this.frameCount - 1);
                    }
                    else if (this.overAndRemove) {
                        NForm.LazyCall(() => {
                            this.RemoveMe();
                        });
                    }
                    else if (!this.overAndRemove) {
                        this.times = 0;
                    }
                }
            }
            else {
                if (this.lateFrameList && this.lateFrameList.Item2 > 0) {
                    if (this.times * 100 / this.frames.Count >= this.lateFrameList.Item1) {
                        this.lateFrameList.Item2--;
                        return false;
                    }
                }
                if (this.times >= this.frames.Count) {
                    if (this.endAct) {
                        this.endAct();
                    }
                }
                if (this.times >= this.frames.Count) {
                    if (this.stopAtEnd) {
                        this.Stop(this.frames.Count - 1);
                    }
                    else if (this.stopFrame >= 0) {
                        this.Stop(this.stopFrame);
                        //frames = null;/??
                    }
                    else {
                        this.times = 0;
                    }
                    if (this.lateFrameList && this.origLateFrameList) {
                        this.lateFrameList.Item1 = this.origLateFrameList.Item1;
                        this.lateFrameList.Item2 = this.origLateFrameList.Item2;
                    }
                }
                if (frames) {
                    if (this.img) {
                        //this.img.SetData(this.arr[frames[this.times]]);
                    }
                    if (this.enterFrame) {
                        this.enterFrame(this.times);
                    }
                    if (this.enterFrame1) {
                        this.enterFrame1(this.times);
                    }
                    this.times += this.addTime;
                }
            }
        }
        return this.disposed;
    }

    public Dispose() {
        super.Dispose();
        if (this.arr) {
            this.arr.Clear();
            this.arr = null;
        }
        this.img = null;
        this.enterFrame = null;
        this.enterFrame1 = null;
        this.endAct = null;
        this.lateFrameList = null;
        this.origLateFrameList = null;
    }
}

window["NAniBase"] = NAniBase;
