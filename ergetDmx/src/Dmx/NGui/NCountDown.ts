//倒计时类
//使用方法：
// let time = new NCountDown(true, "", 15, 0xffff00, (val) => {
//     return "剩余时间：" + val;
// });
// time.align = 1;//居中显示
// this.Add(time, 480, 400);
class NCountDown extends Sx {
    private func: Function;
    private isTime: boolean;
    private item: Listx;
    private guid: string;
    private startTime: number;
    private allTime: number;
    public tick: number = -1;
    private stop: number = 0;
    public leftTime: number;
    private _defaultVal: string = "";
    public l: any;

    public constructor(isTime: boolean = true, nnum: string = "", size: number = -1, color: number = 0xffffff, func: Function = null) {
        super();
        this.item = new Listx();
        this.func = func;
        this.isTime = isTime;

        this.item["index"] = 0;

        if (nnum.IsFull()) {
            this.l = new NNum("", nnum, false, size);
        } else {
            this.l = new NLabel("", color, false, size);
        }

        this.item.Listen(() => {
            if (isTime) {
                if (this.item["index"].ToInt() <= 0 && this.defaultVal.IsFull()) {
                    if (func) {
                        this.l.val = func(this.defaultVal);
                    } else {
                        this.l.val = this.defaultVal;
                    }
                } else {
                    if (func) {
                        this.l.val = func(Time.GetTimeSpan(this.item["index"]));
                    } else {
                        this.l.val = Time.GetTimeSpan(this.item["index"]);
                    }
                }
            } else {
                if (this.item["index"].ToInt() == 0 && this.defaultVal.IsFull()) {
                    if (func) {
                        this.l.val = func(this.defaultVal);
                    } else {
                        this.l.val = this.defaultVal;
                    }
                } else {
                    if (func) {
                        this.l.val = func(this.item["index"]);
                    } else {
                        this.l.val = this.item["index"];
                    }
                }
            }
        }, "index", this.l);

        this.Add(this.l);
    }

    public get align(): number {
        return this.l.align;
    }

    public set align(val: number) {
        this.l.align = val;
    }

    public get defaultVal(): string {
        return this._defaultVal;
    }

    public set defaultVal(val: string) {
        this._defaultVal = val;
        if (this.item["index"].ToInt() == 0) {
            this.l.val = val;
        }
    }

    public get val(): number {
        return this.item["index"].ToInt();
    }

    public Start(allTime: number, finishFunc: Function = null, timerFunc: Function = null): void {
        this.Stop();
        this.stop++;
        var stopIndex: number = this.stop;
        this.allTime = allTime;
        this.item.s("index", allTime);
        this.startTime = new Date().getTime();
        NForm.SetInterval(500, () => {
            if (stopIndex != this.stop) {
                return stopIndex != this.stop;
            }
            var now: number = new Date().getTime();
            var time1: number = (now - this.startTime) / 1000;
            var index: number = Math.floor(allTime + time1 * this.tick);
            if (index < 0) {
                index = 0;
            }
            this.item["index"] = index;
            this.leftTime = index;
            if (timerFunc) {
                timerFunc();
            }
            if (index <= 0) {
                this.Stop();
                if (finishFunc) {
                    finishFunc();
                }
            }
            return stopIndex != this.stop;
        });
    }

    public Stop(): void {
        this.stop++;
        this.item["index"] = 0;
    }

    public StopAt(allTime: number): void {
        this.stop++;
        this.item["index"] = allTime;
    }

    public Dispose() {
        this.Stop();
        this.func = null;
        super.Dispose();
    }
}

window["NCountDown"] = NCountDown;