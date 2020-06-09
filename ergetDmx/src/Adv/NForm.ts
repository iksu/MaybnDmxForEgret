///<reference path="../Dmx/Arr.ts" />

class NForm {
    public static NARROW: boolean = false;//竖屏情况下，iphoneX会发生这种情况
    public static WIDE: boolean = false;//竖屏情况下，会发生这种情况

    public static stageFg: Sx;//舞台前景
    public static stageBg: Sx;//舞台背景


    public static moved: boolean = false;
    public static styleSetupLoad: boolean = false;

    public static stage: egret.Stage;
    public static main: Sx;
    public static top: Sx;
    public static middle: Sx;
    public static middle1: Sx;
    public static overTop: Sx;

    public static stageScale: number = 1;
    public static stageWidthOffset: number = 0;
    public static stageHeightOffset: number = 0;
    public static stageX: number = 0;
    public static stageY: number = 0;

    public static downDt: Date;

    public static Load(stage: egret.Stage) {
        NForm.stage = stage;
        NForm.Down(() => {
            NForm.downDt = new Date();
        }, NForm.main);
    }

    public static HideMain() {
        NForm.main.Hide();
    }

    public static ShowMain() {
        NForm.main.Show();
    }

    public static get width(): number {
        return NForm.stage.stageWidth + NForm.stageWidthOffset;
    }

    public static get height(): number {
        return NForm.stage.stageHeight + NForm.stageHeightOffset;
    }

    public static TopLeft(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        dis.Pos(x, y);
    }

    public static TopLeftExtra(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        NForm.TopLeft(dis, x, y);
    }

    public static Top(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 + x, y);
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static TopExtra(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 - dis.width / 2 + x, y);
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static TopRight(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.Pos(NForm.width + x, y);
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static TopRightExtra(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        NForm.TopRight(dis, -dis.width + x, y);
    }

    public static Left(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.Pos(x, NForm.height / 2 + y);
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static LeftExtra(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        NForm.Left(dis, x, -dis.height / 2 + y);
    }

    public static Center(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 + x, NForm.height / 2 + y);
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static CenterExtra(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act = function (ev: Event): void {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 - dis.width / 2 + x, NForm.height / 2 - dis.height / 2 + y);
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static Right(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.Pos(NForm.width + x, NForm.height / 2 + y);
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static RightExtra(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        NForm.Right(dis, -dis.width + x, -dis.height / 2 + y);
    }

    public static BottomLeft(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.Pos(x, NForm.height + y);
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static BottomLeftExtra(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        NForm.BottomLeft(dis, x, -dis.height + y);
    }

    public static Bottom(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 + x, NForm.height + y);
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static BottomExtra(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 - dis.width / 2 + x, NForm.height - dis.height + y);
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static BottomRight(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.Pos(NForm.width + x, NForm.height + y);
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static BottomRightExtra(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        NForm.BottomRight(dis, -dis.width + x, -dis.height + y);
    }

    public static Full(dis: any, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            dis.width = NForm.width + x;
            dis.height = NForm.height + y;
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static FullAndStageZero(dis: any, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            dis.width = NForm.width + x;
            dis.height = NForm.height + y;
            NForm.LazyCall(function (): void {
                NForm.LazyCall(function (): void {
                    NForm.LazyCall(function (): void {
                        if (dis.parent != NForm.stage) {
                            dis.x = -(<Sx>dis.parent).globalX;
                            dis.y = -(<Sx>dis.parent).globalY;
                        } else {
                            dis.x = 0;
                            dis.y = 0;
                        }
                    });
                });
            });
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static FullExtra(dis: Ix, x: number = 0, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            dis.width = NForm.width + x;
            dis.height = NForm.height + y;
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static FullWidth(dis: Ix, x: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.width = NForm.width + x;
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static FullHeight(dis: Ix, y: number = 0): void {
        if (dis.disposed) {
            return;
        }
        var act: Function = function (ev: Event): void {
            if (!dis.disposed) {
                dis.height = NForm.height + y;
            } else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    }

    public static Click(func: Function, sx: Ix): void {
        NForm.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, func, NForm.stage);
        sx.OnDispose(() => {
            NForm.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, NForm.stage);
        });
    }

    public static Down(func: Function, sx: Ix): void {
        NForm.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, func, NForm.stage);
        sx.OnDispose(() => {
            NForm.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, func, NForm.stage);
        });
    }

    public static Up(func: Function, sx: Ix): void {
        NForm.stage.addEventListener(egret.TouchEvent.TOUCH_END, func, NForm.stage);
        sx.OnDispose(() => {
            NForm.stage.removeEventListener(egret.TouchEvent.TOUCH_END, func, NForm.stage);
        });
    }

    public static Move(func: Function, sx: Ix): void {
        NForm.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, func, NForm.stage);
        sx.OnDispose(() => {
            NForm.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, func, NForm.stage);
        });
    }

    public static Resize(func: Function, sx: Ix): void {
        NForm.stage.addEventListener(egret.Event.RESIZE, func, NForm.stage);
        sx.OnDispose(() => {
            NForm.stage.removeEventListener(egret.Event.RESIZE, func, NForm.stage);
        });
    }

    // public static KeyUp(func: Function, sx: Sx): void {
    //     //NForm.stage.addEventListener(KeyboardEvent.KEY_UP,func);
    // }

    // public static KeyDown(func: Function, sx: Sx): void {
    //     //NForm.stage.addEventListener(KeyboardEvent.KEY_DOWN,func);
    // }

    // public static RemoveListenerClick(func: Function): void {
    //     NForm.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, NForm.stage);
    // }

    // public static RemoveListenerUp(func: Function): void {
    //     NForm.stage.removeEventListener(egret.TouchEvent.TOUCH_END, func, NForm.stage);
    // }

    // public static RemoveListenerMove(func: Function): void {
    //     NForm.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, func, NForm.stage);
    // }

    // public static RemoveListenerResize(func: Function): void {
    //     NForm.stage.removeEventListener(egret.Event.RESIZE, func, NForm.stage);
    // }

    // public static RemoveListenerKeyUp(func: Function): void {
    //     //NForm.stage.removeEventListener(KeyboardEvent.KEY_UP,func);
    // }

    // public static RemoveListenerKeyDown(func: Function): void {
    //     //NForm.stage.removeEventListener(KeyboardEvent.KEY_DOWN,func);
    // }

    private static _mouseXYEvent: boolean = false;
    private static _mouseX: number = -1;
    public static get mouseX(): number {
        if (!NForm._mouseXYEvent) {
            NForm._mouseXYEvent = true;
            NForm.Move((ev) => {
                NForm._mouseX = ev.stageX;
                NForm._mouseY = ev.stageY;
            }, NForm.main);
        }
        if (NForm._mouseX < 0) {
            return NForm.width / 2;
        } else {
            return NForm._mouseX;
        }
    }

    private static _mouseY: number = -1;
    public static get mouseY(): number {
        if (!NForm._mouseXYEvent) {
            NForm._mouseXYEvent = true;
            NForm.Move((ev) => {
                NForm._mouseX = ev.stageX;
                NForm._mouseY = ev.stageY;
            }, NForm.main);
        }
        if (NForm._mouseY < 0) {
            return NForm.height / 2;
        } else {
            return NForm._mouseY;
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////    
    public static EnterFrame(ev: egret.Event) {
        try {
            if (NForm.toList != null && NForm.toList.Length > 0) {
                NForm.toList.Each((fi) => {
                    var ix = fi[5];
                    if (ix != null && !ix.disposed) {
                        ix.x = fi[1].x - fi[0].x * fi[2];
                        ix.y = fi[1].y - fi[0].y * fi[2];
                    }
                    if (fi[2] <= 0) {
                        if (ix != null && !ix.disposed) {
                            ix.x = fi[1].x;
                            ix.y = fi[1].y;
                        }
                        NForm.toList.Remove(fi);
                        if (fi[3] != null) {
                            try {
                                fi[3];
                            }
                            catch (ex) {
                                Js.Trace(ex)
                            }
                        }
                        fi = null;
                    } else {
                        fi[2]--;
                    }
                });
            }
        }
        catch (ex) {
            Js.Trace(ex)
        }

        try {
            if (NForm.toTargetList != null && NForm.toTargetList.Length > 0) {
                NForm.toTargetList.Each((fi) => {
                    var ix = fi[6];
                    if (ix != null && !ix.disposed) {
                        ix.x = fi[1].x + fi[4].x - (fi[1].x + fi[4].x - fi[0].x) * fi[2] / fi[3];
                        ix.y = fi[1].y + fi[4].y - (fi[1].y + fi[4].y - fi[0].y) * fi[2] / fi[3];
                    }
                    if (fi[2] <= 0) {
                        if (ix != null && !ix.disposed) {
                            ix.x = fi[1].x + fi[4].x;
                            ix.y = fi[1].y + fi[4].y;
                        }
                        NForm.toTargetList.Remove(fi);
                        if (fi[5] != null) {
                            try {
                                fi[5]();
                            }
                            catch (ex) {
                                Js.Trace(ex)
                            }
                        }
                        fi = null;
                    } else {
                        fi[2]--;
                    }
                });
            }
        }
        catch (ex) {
            Js.Trace(ex)
        }
        try {
            if (NForm.valuesToList != null && NForm.valuesToList.Count > 0) {
                NForm.valuesToList.Each((fi) => {
                    try {
                        if (fi[2] <= 0) {
                            fi[3](fi[1]);
                            NForm.valuesToList.Remove(fi);
                            if (fi[4] != null) {
                                fi[4]();
                            }
                            fi = null;
                        }
                        else {
                            fi[3](fi[1] - fi[0] * fi[2]);
                            fi[2]--;
                        }
                    }
                    catch (ex) {
                        Js.Trace(ex)
                        NForm.valuesToList.Remove(fi);
                        fi = null;
                    }
                });
            }
        }
        catch (ex) {
            Js.Trace(ex)
        }

        try {
            if (NForm.setTimeoutList != null && NForm.setTimeoutList.Count > 0) {
                var now: DateTime = Server.Now;
                NForm.setTimeoutList.Each((fi) => {
                    try {
                        if (fi) {
                            if (now.time >= fi[0].time) {
                                NForm.setTimeoutList.Remove(fi);
                                fi[1]();
                                fi = null;
                            }
                        }
                    }
                    catch (ex) {
                        Js.Trace(ex)
                        NForm.setTimeoutList.Remove(fi);
                        fi = null;
                    }
                });
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
        try {
            if (NForm.setIntervalList != null && NForm.setIntervalList.Count > 0) {
                var now = Server.Now;
                NForm.setIntervalList.Each((fi) => {
                    try {
                        if (fi) {
                            if (now.time >= fi[0].time) {
                                if (fi[2]()) {
                                    NForm.setIntervalList.Remove(fi);
                                    fi = null;
                                }
                                else {
                                    fi[0] = now.AddMilliseconds(fi[1]);
                                }
                            }
                        }
                    }
                    catch (ex) {
                        Js.Trace(ex);
                        NForm.setIntervalList.Remove(fi);
                        fi = null;
                    }
                });
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
    }

    private static toList: Arr<any>;//Dictionary<Ix, Tuplex<Vector3, Vector3, int, Action>>
    public static To(ix: Ix, vec: Vector2, times: number = 20, act: Function = null)//TODO:times改为time
    {
        //times = times * fixedFrameRate / 60;//TODO:
        if (ix == null || ix.disposed) {
            return;
        }
        if (NForm.toList == null) {
            NForm.toList = new Arr<any>();
        }
        if (NForm.toTargetList == null) {
            NForm.toTargetList = new Arr<any>();
        }
        NForm.toList.RemoveBy((fi) => {
            return fi[5] == ix;
        });
        NForm.toTargetList.RemoveBy((fi) => {
            return fi[6] == ix;
        });
        var item = [new Vector2(0.01 * ((vec.x - ix.x) * 100 / times), 0.01 * ((vec.y - ix.y) * 100 / times)), vec, times, act, ix];
        NForm.toList.Add(item);
    }

    /// <summary>
    /// 物件，type，offset，to，times次数，times总次数，act
    /// </summary>
    private static toTargetList: Arr<any>;
    public static ToTarget(ix: Ix, target: Sx, offset: Vector2, times: number = 20, act: Function = null)//TODO:times改为time
    {
        //times = times * fixedFrameRate / 60;//TODO:
        if (ix == null || ix.disposed) {
            return;
        }
        if (NForm.toList == null) {
            NForm.toList = new Arr<any>();
        }
        if (NForm.toTargetList == null) {
            NForm.toTargetList = new Arr<any>();
        }
        NForm.toList.RemoveBy((fi) => {
            return fi[5] == ix;
        });
        NForm.toTargetList.RemoveBy((fi) => {
            return fi[6] == ix;
        });
        var item = [new Vector2(ix.x, ix.y), target, times, times, offset, act, ix];
        NForm.toTargetList.Add(item);
    }

    /// <summary>
    /// offset，to，times总次数，act
    /// </summary>
    private static valuesToList: Arr<any>;
    public static ValuesTo(begin: number, to: number, times: number, act: Function, end: Function = null) {
        //times = times * fixedFrameRate / 60;//TODO:
        if (NForm.valuesToList == null) {
            NForm.valuesToList = new Arr<any>();
        }
        var item = [(to - begin) / times, to, times, act, end];
        NForm.valuesToList.Add(item);
    }

    private static setTimeoutList: Arr<any>;
    public static SetTimeout(time: number, act: (...arg) => void) {
        if (NForm.setTimeoutList == null) {
            NForm.setTimeoutList = new Arr<any>();
        }
        var item = [Server.Now.AddMilliseconds(time), act];
        NForm.setTimeoutList.Add(item);
    }


    private static setIntervalList: Arr<any>;
    public static SetInterval(time: number, act: (...arg) => void) {
        if (NForm.setIntervalList == null) {
            NForm.setIntervalList = new Arr<any>();
        }
        var item = [Server.Now.AddMilliseconds(time), time, act];
        NForm.setIntervalList.Add(item);
    }

    public static MainThread(act: (...arg) => void) {
        NForm.SetTimeout(1, act);
    }

    public static LazyCall(act: (...arg) => void) {
        NForm.SetTimeout(1, act);
    }
    //////////////////////////////////////
    private static autoHideList: Arr<Sx> = new Arr<Sx>();
    public static AddHandleAutoHide(sx: Sx) {
        NForm.autoHideList.Add(sx);
    }

    public static HandleAutoHide(): void {
        var count = 0;
        NForm.autoHideList.Each(function (sx: Sx) {
            if (sx.disposed) {
                NForm.autoHideList.Remove(sx);
                sx = null;
            } else {
                if (sx.showTop50 && count >= 50) {
                    sx.HandleAutoHide_Hide();
                } else {
                    var rv: boolean = sx.HandleAutoHide();
                    if (rv) {
                        if (sx.showTop50) {
                            count++;
                        }
                    }
                }
            }
        });
    }
}

window["NForm"] = NForm;