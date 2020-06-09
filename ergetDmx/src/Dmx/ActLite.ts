//简易高效缓动类
//一般直接调用Sx的方法
//使用方法：
//     let p = new Sx();
//     this.Add(p); 
//     p.To({ x: 100, y:100 }, time, () => {
//         p.To({ alpha: 0 }, 500, () => {
//             p.RemoveMe();
//         });
//     });
class ActLite {
    public static To(sx: any, stateTo: any, time: number = 1000, onEndFunc: Function = null, parseHandle: Function = null): any {
        let frameCount = time / 30;
        let stateFrom = {};
        for (let fi in stateTo) {
            stateFrom[fi] = sx[fi];
        }
        let stateInterVal = {};
        for (let fi in stateTo) {
            stateInterVal[fi] = (stateTo[fi] - stateFrom[fi]) / frameCount;
        }

        let actId = Strx.Rnd(999999);
        sx.actId = actId;
        let index: number = 0;
        let interval = () => {
            if (sx.actId != actId) {
                return true;
            }
            if (sx instanceof Sx) {
                if ((<Sx>sx).disposed) {
                    return true;
                }
            } else if (sx instanceof Bx) {
                if ((<Bx>sx).disposed) {
                    return true;
                }
            }
            for (let fi in stateTo) {
                if (parseHandle) {
                    sx[fi] = parseHandle(stateInterVal[fi] * index + stateFrom[fi], sx);
                } else {
                    sx[fi] = stateInterVal[fi] * index + stateFrom[fi];
                }
            }
            // if (onChangeHandle) {
            //     onChangeHandle(sx);
            // }
            if (index >= frameCount) {
                for (let fi in stateTo) {
                    sx[fi] = stateTo[fi];
                }
                if (onEndFunc) {
                    onEndFunc();
                }
                return true;
            }
            index++;
            return false;
        };
        NForm.SetInterval(30, interval);
    }


    //可以向移动的目标移动
    public static ToTarget(sx: any, target: any, offsetx, offsety, time: number = 1000, onEndFunc: Function = null): any {
        let frameCount = time / 30;
        let stateFrom = {};

        stateFrom["x"] = sx.x;
        stateFrom["y"] = sx.y;

        // let stateInterVal = {};
        // for (let fi in stateTo) {
        //     stateInterVal[fi] = (stateTo[fi] - stateFrom[fi]) / frameCount;
        // }

        let actId = Strx.Rnd(999999);
        sx.SetTemp("actId", actId);
        let index: number = 0;
        let interval = () => {
            if (sx.GetTemp("actId") != actId) {
                return true;
            }
            if (sx instanceof Sx) {
                if ((<Sx>sx).disposed) {
                    return true;
                }
            } else if (sx instanceof Bx) {
                if ((<Bx>sx).disposed) {
                    return true;
                }
            }

            let frameCount1 = frameCount - index + 1;
            if (frameCount1 <= 0) {
                frameCount1 = 1;
            }
            sx.x = sx.x + (target.x + offsetx - sx.x) / frameCount1;
            sx.y = sx.y + (target.y + offsety - sx.y) / frameCount1;

            if (index >= frameCount) {
                sx.x = target.x + offsetx;
                sx.y = target.y + offsety;

                if (onEndFunc) {
                    onEndFunc();
                }
                return true;
            }
            index++;
            return false;
        };
        NForm.SetInterval(30, interval);
    }

    // public static QuadTo(t: number, p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2) {
    //     let point = new Vector2(0, 0);
    //     let temp = 1 - t;

    //     point.x = p0.x * temp * temp * temp + 3 * p1.x * t * temp * temp + 3 * p2.x * t * t * temp + p3.x * t * t * t;
    //     point.y = p0.y * temp * temp * temp + 3 * p1.y * t * temp * temp + 3 * p2.y * t * t * temp + p3.y * t * t * t;

    //     return point;
    // }

    // public static QuadArrTo(t: number, arr: Array<Vector2>) {
    //     switch (arr.length) {
    //         case 3:
    //             return this.QuadTo(t, arr[0], arr[1], arr[1], arr[2]);
    //         case 4:
    //             return this.QuadTo(t, arr[0], arr[1], arr[2], arr[3]);
    //         default:
    //             return this.QuadTo(t, arr[0], arr[0], arr[0], arr[0]);
    //     }
    // }

    // public static UniformSpeed(t: number, arr: Array<Vector2>) {
    //     return this.QuadTo(this.Time(arr, t), arr[0], arr[1], arr[2], arr[3]);
    // }



    // public static Time(arr: Array<Vector2>, t: number) {
    //     // 定义真实时间与差时变量
    //     let realTime, deltaTime;

    //     // 曲线上的 x 坐标
    //     let bezierX;

    //     // 计算 t 对应曲线上匀速的 x 坐标
    //     let x = 100 + (arr[3].x - arr[0].x) * t;

    //     realTime = 1;
    //     do {
    //         // 半分
    //         if (deltaTime > 0) {
    //             realTime -= realTime / 2;
    //         }
    //         else {
    //             realTime += realTime / 2;
    //         }

    //         // 计算本此 "rt" 对应的曲线上的 x 坐标
    //         bezierX = this.QuadArrTo(realTime, arr);

    //         // 计算差时
    //         deltaTime = bezierX - x;
    //     }
    //     // 差时逼近为0时跳出循环
    //     while (deltaTime != 0);

    //     return realTime;
    // }
}

window["ActLite"] = ActLite;