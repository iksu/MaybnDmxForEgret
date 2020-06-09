class NAniSx extends NAniBase {
    private backForth: boolean;
    private intervalObj: any;
    private framesCount: number;
    private finishFunc: Function;
    public dis: Ix;

    public constructor(dis: Ix, stateFrom: any, stateTo: any, frames: number, backForth: boolean = false, finishFunc: Function = null, overAndRemove: boolean = true) {
        super(overAndRemove)
        this.Setup(dis, stateFrom, stateTo, frames, backForth, finishFunc);
    }

    private Setup(dis: Ix, stateFrom: any, stateTo: any, framesCount: number, backForth: boolean = false, finishFunc: Function = null) {
        this.backForth = backForth;
        this.intervalObj = {};
        this.framesCount = framesCount;
        this.finishFunc = finishFunc;

        this.dis = dis;
        super.Add(dis);

        let arr = new Arr<any>();
        if (backForth) {
            for (let i = 0; i < framesCount * 2; i++) {
                arr.Add(this);
            }
        }
        else {
            for (let i = 0; i < framesCount; i++) {
                arr.Add(this);
            }
        }
        for (var fi in stateFrom) {
            this.intervalObj[fi] = (stateTo[fi] - stateFrom[fi]) / this.framesCount;
        }

        this.enterFrame = (times) => {
            if (backForth) {
                let curTimes = times;
                if (curTimes >= framesCount) {
                    for (var fi in stateFrom) {
                        dis[fi] = stateTo[fi] - (curTimes - framesCount + 1) * this.intervalObj[fi];
                    }
                    if (curTimes == framesCount * 2 - 1) {
                        if (finishFunc) {
                            finishFunc();
                        }
                    }
                }
                else {
                    for (var fi in stateFrom) {
                        dis[fi] = stateFrom[fi] + curTimes * this.intervalObj[fi];
                    }
                }
            }
            else {
                let curTimes = times;
                for (var fi in stateFrom) {
                    dis[fi] = stateFrom[fi] + curTimes * this.intervalObj[fi];
                }
                if (curTimes == framesCount - 1) {
                    if (finishFunc) {
                        finishFunc();
                    }
                }
            }
        };
        this.Load(arr);
    }

    public get width(): number {
        return this.dis.width;
    }

    public get height(): number {
        return this.dis.height;
    }
}

window["NAniSx"] = NAniSx;