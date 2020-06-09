//精灵类
///<reference path="Js.ts" />
class Sx extends eui.Group implements Ix {//sx继承eui.group 作为ix接口实现
    public that = this;//设that = this
    public showTop50: boolean = false;//设置布尔型
    public base: boolean = false;//true后将不会被removeall
    public isLoaded: boolean = false;

    public guideX: number = 0;
    public guideY: number = 0;
    public getGuideX: Function;
    public getGuideY: Function;
    public guidePos: number = 0;
    public warn: boolean = true;
    public sxIndex: number = 0;
    public showTipWarn: boolean = true;
    public static index: number = 0;

    public continueGuide: boolean = false;

    public SetAutoHide(showTop50: boolean = false) {
        this.showTop50 = showTop50;
        NForm.AddHandleAutoHide(this);
    }

    public constructor() {
        super();
        Sx.index++;
        this.sxIndex = Sx.index;

        this.addEventListenerSx(egret.Event.REMOVED, Sx.OnRemove);
        this.touchEnabled = false;

        try {
            if (this.warn && Js) {
                if (Js.showTrace) {
                    NForm.SetTimeout(100, () => {
                        if (this.warn) {
                            if (!this.disposed && this.parent == null) {
                                Js.Trace("Out Sx: " + this.sxIndex);
                                Js.Trace(this);
                                //this.Dispose();
                            }
                        }
                    });
                }
            }
        } catch (ex) { }
    }

    private _depth: number = 0;
    public get depth(): number {
        return this._depth;
    }

    public set depth(val: number) {
        this._depth = val;
        if (this.parent) {
            let cs = this.parent.$children.sort((a, b) => {
                let a1: any = a;
                let b1: any = b;
                return a1._depth - b1._depth;
            });
            let index = 0;
            cs.forEach(((fi) => {
                this.parent.setChildIndex(fi, index);
                index++;
            }).bind(this));
        }
    }

    private _parent: any;
    public HandleAutoHide_Hide() {
        this.visible = false;
    }

    public HandleAutoHide_Show() {
        this.visible = true;
    }

    private static autoHideOffset: number = 100;
    public HandleAutoHide(): boolean {
        if (this.disposed) {
            return false;
        }
        if (this.visible) {
            let x: number = this.globalX;
            if (x < -Sx.autoHideOffset || x > NForm.width + Sx.autoHideOffset) {
                this.HandleAutoHide_Hide();
                return false;
            }
            let y: number = this.globalY;
            if (y < -Sx.autoHideOffset || y > NForm.height + Sx.autoHideOffset) {
                this.HandleAutoHide_Hide();
                return false;
            }
            return true;
        }
        else {
            let x = this.globalX;
            let y = this.globalY;
            if (x >= -Sx.autoHideOffset && x <= NForm.width + Sx.autoHideOffset && y >= -Sx.autoHideOffset && y <= NForm.height + Sx.autoHideOffset) {
                this.HandleAutoHide_Show();
                return true;
            }
            return false;
        }
    }

    public Add(s2: any, x: number = 0, y: number = 0): boolean {
        if (!this.disposed) {
            if (s2 == null) {
                return false;
            }
            let s = null;
            if (typeof s2 == "string") {
                s = Assert.Img(<string>s2);
            } else {
                s = s2;
            }
            if (x != 0) {
                s.x = x;
            }
            if (y != 0) {
                s.y = y;
            }
            if (s instanceof Sx) {
                if ((<Sx>s).disposed) {
                    Js.TraceDmx("disposed obj added");
                    return false;
                }
            }
            this.addChild(s);
            if (s instanceof Sx) {
                let s1 = <Sx>(s);
                if (s1.depth != Number.MIN_VALUE) {
                    for (let i: number = this.numChildren - 1; i >= 0; i--) {
                        let child1: any = this.getChildAt(i);
                        if (child1 instanceof Sx && !(<Sx>child1).disposed) {
                            let child: Sx = <Sx>(child1);
                            //                                if(child.depth > s1.depth && child != s1) {
                            //                                    this.setChildIndex(s1,i);
                            //                                }//TODO:最新的系统有zIndex进行管理
                        }
                    }
                }
            }
            this.ResetWidthHeight();
            if (s.align == 1) {
                s.PutCenter();
            } else if (s.align == 2) {
                s.PutRight();
            }
            return true;
        }
        else {
            if (s2 instanceof Sx) {
                (s2 as Sx).Dispose();
            } else if (s2 instanceof Bx) {
                (s2 as Bx).Dispose();
            }
        }
        return false;
    }

    public LazyAdd(s: any) {
        NForm.LazyCall(() => {
            if (!this.disposed) {
                this.Add(s, 0, 0);
            }
        });
    }

    public Remove(item: Ix) {
        if (item) {
            try {
                item.RemoveMe();
            } catch (ex) {
                Js.Trace(ex);
            }
        }
    }

    public RemoveDisplayObject(item: egret.DisplayObject) {
        if (item) {
            try {
                if (!this.disposed) {
                    if (item) {
                        if (item.parent) {
                            item.parent.removeChild(item);
                        }
                    }
                }
                if (item instanceof egret.Shape) {
                    (<egret.Shape>item).graphics.clear();
                }
            } catch (ex) {
                Js.Trace(ex);
            }
        }
    }

    public set buttonMode(val: boolean) {
        this.touchEnabled = true;
    }

    public Dispose() {
        if (!this.disposed) {
            this.disposed = true;
            if (this.graphicsed) {
                this.DrawClear();
            }
            this.clearEventListener();
            this.listenerArr = null;
            if (this.onDisposeList) {
                let OnDisposeList = this.onDisposeList;
                this.onDisposeList = null;
                OnDisposeList.Each((fi: Function) => {
                    try {
                        fi()
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                });
                OnDisposeList.Clear();
            }
            if (this.OnLoadList) {
                this.OnLoadList.Clear();
                this.OnLoadList = null;
            }
            if (this.onShowList) {
                this.onShowList.Clear();
                this.onShowList = null;
            }
            if (this.onHideList) {
                this.onHideList.Clear();
                this.onHideList = null;
            }
            if (this.OnPosList) {
                this.OnPosList.Clear();
                this.OnPosList = null;
            }
            if (this.sxInfo) {
                this.sxInfo.Dispose();
            }
            this.that = null;
            for (let i: number = this.numChildren - 1; i >= 0; i--) {
                try {
                    let child = this.getChildAt(i);
                    this.removeChild(child);
                } catch (ex) { }
            }
            //            for(let fi in this) {
            //                delete this[fi]
            //            }
        }
    }

    public IsBG() {
        this.touchEnabled = true;
    }

    public graphicsed: boolean = false;
    public graphics: egret.Shape;
    //    public clear() {
    //        this.graphics.clear();
    //    }
    //
    //    public beginFill(color: number,alpha: number = 1.0) {
    //        this.graphicsed = true;
    //        this.graphics.beginFill(color,alpha);
    //    }
    //
    //    public beginBitmapFill(bitmap: any,matrix: egret.Matrix = null,repeat: boolean = true,smooth: boolean = true) {
    //        this.graphicsed = true;
    //        this.graphics["beginBitmapFill"](bitmap,matrix,repeat,smooth);
    //    }
    //
    //    public drawCircle(x: number,y: number,radius: number) {
    //        this.graphicsed = true;
    //        this.graphics.drawCircle(x,y,radius);
    //    }
    //
    //    public endFill() {
    //        this.graphicsed = true;
    //        this.graphics.endFill();
    //    }
    //
    //    public drawRect(x: number,y: number,width: number,height: number) {
    //        this.graphicsed = true;
    //        this.graphics.drawRect(x,y,width,height);
    //    }
    //
    //    public lineStyle(thickness: number,color: number = 0,alpha: number = 1.0,pixelHinting: boolean = false,scaleMode: string = "normal",caps: string = null,joints: string = null,miterLimit: number = 3) {
    //        this.graphicsed = true;
    //        this.graphics.lineStyle(thickness,color,alpha,pixelHinting,scaleMode,caps,joints,miterLimit);
    //    }
    //
    //    public moveTo(x: number,y: number) {
    //        this.graphicsed = true;
    //        this.graphics.moveTo(x,y);
    //    }
    //
    //    public lineTo(x: number,y: number) {
    //        this.graphicsed = true;
    //        this.graphics.lineTo(x,y);
    //    }


    public SetupGraphics() {
        if (this.graphics == null) {
            this.graphicsed = true;
            this.graphics = new egret.Shape();
            this.Add(this.graphics);
        }
    };

    public DrawRect(x: number, y: number, width: number, height: number, color: number, alpha: number) {
        this.SetupGraphics();
        this.graphics.graphics.beginFill(color, alpha);
        this.graphics.graphics.drawRect(x, y, width, height);
        this.graphics.graphics.endFill();
    }

    public DrawRoundRect(x: number, y: number, width: number, height: number, colors: Array<number>, alphas: Array<number>, ellipse: number) {
        this.SetupGraphics();
        if (colors.length == 1) {
            this.graphics.graphics.beginFill(colors[0], alphas[0]);
        } else {
            var matrix = new egret.Matrix();
            matrix.createGradientBox(width, height, Math.PI * 0.5, x, y);
            if (alphas.length < colors.length) {
                for (let i = 0, len = colors.length; i < len; i++) {
                    alphas[i] = 1;
                }
            }
            this.graphics.graphics.beginGradientFill(egret.GradientType.LINEAR, colors, alphas, [0, 255], matrix);
        }
        this.graphics.graphics.drawRoundRect(x, y, width, height, ellipse, ellipse);
        this.graphics.graphics.endFill();
    }

    public DrawLine(x1: number, y1: number, x2: number, y2: number, lineHeight: number, color: number, alpha: number) {
        this.SetupGraphics();
        this.graphics.graphics.lineStyle(lineHeight, color, alpha);
        this.graphics.graphics.moveTo(x1, y1);
        this.graphics.graphics.lineTo(x2, y2);
    }

    public DrawArc(x: number, y: number, radius: number, fromAngle: number, endAngle: number, colors: Array<number>, alphas: Array<number>) {
        this.SetupGraphics();
        if (colors.length == 1) {
            this.graphics.graphics.beginFill(colors[0], alphas[0]);
        } else {
            let matrix = new egret.Matrix();
            matrix.createGradientBox(radius, radius, Math.PI * 0.5, x, y);
            if (alphas.length < colors.length) {
                for (let i = 0, len = colors.length; i < len; i++) {
                    alphas[i] = 1;
                }
            }
            this.graphics.graphics.beginGradientFill(egret.GradientType.LINEAR, colors, alphas, [0, 255], matrix);
        }
        this.DrawFan(radius, Math.PI * fromAngle / 180, Math.PI * endAngle / 180);
        this.graphics.graphics.endFill();
    }

    public DrawCircle(x: number, y: number, radius: number, colors: Array<number>, alphas: Array<number>) {
        this.SetupGraphics();
        if (colors.length == 1) {
            this.graphics.graphics.beginFill(colors[0], alphas[0]);
        } else {
            let matrix = new egret.Matrix();
            matrix.createGradientBox(radius, radius, Math.PI * 0.5, x, y);
            if (alphas.length < colors.length) {
                for (let i = 0, len = colors.length; i < len; i++) {
                    alphas[i] = 1;
                }
            }
            this.graphics.graphics.beginGradientFill(egret.GradientType.LINEAR, colors, alphas, [0, 255], matrix);
        }
        this.graphics.graphics.drawCircle(x, y, radius);
        this.graphics.graphics.endFill();
    }

    public DrawFan(radius: number, startAngle: number, endAngle: number) {
        let unitDrawAngle = 0.12;
        let tx: number;
        let ty: number;
        let times: number = Math.ceil((endAngle - startAngle) / unitDrawAngle);
        let tempAngle: number = startAngle;

        this.graphics.graphics.lineStyle(1, 0xffffff, 1);

        this.graphics.graphics.moveTo(radius, radius);
        tx = radius * (1 + Math.cos(startAngle));
        ty = radius * (1 - Math.sin(startAngle));
        this.graphics.graphics.lineTo(tx, ty);

        while (times > 0) {
            if (times != 1) {
                tx = radius * (1 + Math.cos(tempAngle + unitDrawAngle));
                ty = radius * (1 - Math.sin(tempAngle + unitDrawAngle));
            } else {
                tx = radius * (1 + Math.cos(endAngle));
                ty = radius * (1 - Math.sin(endAngle));
            }
            this.graphics.graphics.lineTo(tx, ty);

            tempAngle += unitDrawAngle;
            times--;
        }
        this.graphics.graphics.lineTo(radius, radius);
    }

    public DrawSixth(x: number, y: number, radius: number, borderColor: number, borderHeight: number, borderAlpha: number, colors: Array<number>, alphas: Array<number>) {
        this.SetupGraphics();
        if (colors.length == 1) {
            this.graphics.graphics.beginFill(colors[0], alphas[0]);
        } else {
            let matrix = new egret.Matrix();
            matrix.createGradientBox(radius, radius, Math.PI * 0.5, x, y);
            if (alphas.length < colors.length) {
                for (let i = 0, len = colors.length; i < len; i++) {
                    alphas[i] = 1;
                }
            }
            this.graphics.graphics.beginGradientFill(egret.GradientType.LINEAR, colors, alphas, [0, 255], matrix);
        }
        //////////////////
        let unitDrawAngle = 60;
        let startAngle = 0;
        let endAngle = 360;

        let tx: number;
        let ty: number;
        let times: number = 6
        let tempAngle: number = startAngle;

        this.graphics.graphics.lineStyle(borderHeight, borderColor, borderAlpha);

        for (let i = 0; i <= 6; i++) {
            let angle = 30 + 360 * i / 6;
            tx = x + radius * Math.cos(angle * (3.1415926 / 180));
            ty = y + radius * Math.sin(angle * (3.1415926 / 180));
            if (i == 0) {
                this.graphics.graphics.moveTo(tx, ty);
            } else {
                this.graphics.graphics.lineTo(tx, ty);
            }
        }
        //////////////////
        this.graphics.graphics.endFill();
    }

    public DrawClear() {
        if (this.graphics) {
            this.graphics.graphics.clear();
        }
    }

    public static _clickEvent: egret.TouchEvent = new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP);
    public static get clickEvent(): egret.TouchEvent {
        //Sx._clickEvent.localX = 0;
        //Sx._clickEvent.localY = 0;
        return Sx._clickEvent;
    }

    public Click(func: Function) {
        this.addEventListenerSx(egret.TouchEvent.TOUCH_TAP, (ev) => {
            try {
                let now = new Date();
                let ts = now.getTime() - NForm.downDt.getTime();
                if (ts >= 1500) {
                    return;
                }
                if (this["hitAreaRect"]) {
                    let stageX = ev.stageX;
                    let stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= this.globalX + this["hitAreaRect"]["x"] && stageX <= this.globalX + this["hitAreaRect"]["x"] + this["hitAreaRect"].width) {
                        if (stageY >= this.globalY + this["hitAreaRect"]["y"] && stageY <= this.globalY + this["hitAreaRect"]["y"] + this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                } else {
                    try {
                        func(ev);
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                }
            } catch (ex) {
                Js.Trace(ex);
            }
        });
    }

    public DblClick(func: Function) {
        //this.doubleClickEnabled = true;//TODO;
    }

    public Over(func: Function) {
        this.addEventListenerSx(egret.TouchEvent.TOUCH_BEGIN, (ev) => {
            try {
                if (this["hitAreaRect"]) {
                    let stageX = ev.stageX;
                    let stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= this.globalX + this["hitAreaRect"]["x"] && stageX <= this.globalX + this["hitAreaRect"]["x"] + this["hitAreaRect"].width) {
                        if (stageY >= this.globalY + this["hitAreaRect"]["y"] && stageY <= this.globalY + this["hitAreaRect"]["y"] + this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                } else {
                    try {
                        func(ev);
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                }
            } catch (ex) {
                Js.Trace(ex);
            }
        });
    }

    public OutAndUp(func: Function) {
        this.addEventListenerSx(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, (ev) => {
            try {
                if (this["hitAreaRect"]) {
                    let stageX = ev.stageX;
                    let stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= this.globalX + this["hitAreaRect"]["x"] && stageX <= this.globalX + this["hitAreaRect"]["x"] + this["hitAreaRect"].width) {
                        if (stageY >= this.globalY + this["hitAreaRect"]["y"] && stageY <= this.globalY + this["hitAreaRect"]["y"] + this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                } else {
                    try {
                        func(ev);
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                }
            } catch (ex) {
                Js.Trace(ex);
            }
        });
    }

    public Move(func: Function) {
        this.addEventListenerSx(egret.TouchEvent.TOUCH_MOVE, (ev) => {
            try {
                if (this["hitAreaRect"]) {
                    let stageX = ev.stageX;
                    let stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= this.globalX + this["hitAreaRect"]["x"] && stageX <= this.globalX + this["hitAreaRect"]["x"] + this["hitAreaRect"].width) {
                        if (stageY >= this.globalY + this["hitAreaRect"]["y"] && stageY <= this.globalY + this["hitAreaRect"]["y"] + this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                } else {
                    try {
                        func(ev);
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                }
            } catch (ex) {
                Js.Trace(ex);
            }
        });
    }

    public Down(func: Function) {
        this.addEventListenerSx(egret.TouchEvent.TOUCH_BEGIN, (ev) => {
            try {
                if (this["hitAreaRect"]) {
                    let stageX = ev.stageX;
                    let stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= this.globalX + this["hitAreaRect"]["x"] && stageX <= this.globalX + this["hitAreaRect"]["x"] + this["hitAreaRect"].width) {
                        if (stageY >= this.globalY + this["hitAreaRect"]["y"] && stageY <= this.globalY + this["hitAreaRect"]["y"] + this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                } else {
                    try {
                        func(ev);
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                }
            } catch (ex) {
                Js.Trace(ex);
            }
        });
    }

    public Up(func: Function) {
        this.addEventListenerSx(egret.TouchEvent.TOUCH_END, (ev) => {
            try {
                if (this["hitAreaRect"]) {
                    let stageX = ev.stageX;
                    let stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= this.globalX + this["hitAreaRect"]["x"] && stageX <= this.globalX + this["hitAreaRect"]["x"] + this["hitAreaRect"].width) {
                        if (stageY >= this.globalY + this["hitAreaRect"]["y"] && stageY <= this.globalY + this["hitAreaRect"]["y"] + this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                } else {
                    try {
                        func(ev);
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                }
            } catch (ex) {
                Js.Trace(ex);
            }
        });
    }

    // public RemoveListenerClick(func: Function) {
    //     this.removeEventListenerSx(egret.TouchEvent.TOUCH_TAP, func);
    // }

    // public RemoveListenerOver(func: Function) {
    //     this.removeEventListenerSx(egret.TouchEvent.TOUCH_BEGIN, func);
    // }

    // public RemoveListenerOut(func: Function) {
    //     this.removeEventListenerSx(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, func);
    // }

    // public RemoveListenerDown(func: Function) {
    //     this.removeEventListenerSx(egret.TouchEvent.TOUCH_BEGIN, func);
    // }

    // public RemoveListenerUp(func: Function) {
    //     this.removeEventListenerSx(egret.TouchEvent.TOUCH_END, func);
    // }

    // public RemoveListenerMove(func: Function) {
    //     this.removeEventListenerSx(egret.TouchEvent.TOUCH_MOVE, func);
    // }

    public checkEventAlpha: boolean = false;
    public Flatten() {
    }

    public UnFlatten() {
    }

    public SetChildrenMouseDisabled(): Sx {
        this.touchEnabled = false;
        this.touchChildren = false;
        return this;
    }

    public SetChildrenMouseEnabled(): Sx {
        this.touchEnabled = true;
        this.touchChildren = true;
        return this;
    }

    public SetHitArea(rect: egret.Rectangle, show: boolean = false, inner: boolean = false): Sx {
        let hit: egret.Shape = new egret.Shape();
        hit.graphics.beginFill(0x0);
        hit.graphics.drawRect(0, 0, rect.width, rect.height);
        hit.graphics.endFill();
        hit.alpha = 0;
        this.Add(hit, rect.x, rect.y);
        this["hitArea"] = hit;
        if (inner) {
            this["hitAreaRect"] = rect;
        }
        if (show) {
            hit.alpha = 0.5;
        }
        return this;
    }

    ////////////////////////////////
    public autoDispose: boolean = true;
    private listenerArr: Arr<Object>;
    public addEventListenerSx(type: string, listener: Function, u: boolean = false, p: number = 0, w: boolean = false): void {
        this.addEventListener(type, listener, this, u, p);
        if (this.listenerArr == null) {
            this.listenerArr = new Arr<Object>();
        }
        let obj: Object = { type: type, listener: listener };
        this.listenerArr.Add(obj);
        if (type != egret.Event.REMOVED) {
            this.mouseEnabled = true;
        }
    }

    public removeEventListenerSx(type: string, listener: Function, u: boolean = false) {
        this.removeEventListener(type, listener, this);

        if (this.listenerArr) {
            this.listenerArr.Clear();

            for (let i: number = 0, len: number = this.listenerArr.length; i < len; i++) {
                let fi: any = this.listenerArr[i];
                if (fi.type == type && fi.listener == listener) {
                    this.listenerArr.removeItemAt(i);
                    break;
                }
            }
        }
    }

    private onlyRemoveEventListener(type: string, listener: Function, u: boolean = false) {
        super.removeEventListener(type, listener, this);
    }

    public clearEventListener(): void {
        if (this.listenerArr && this.listenerArr.length > 0) {
            this.listenerArr.Each((fi: any) => {
                this.onlyRemoveEventListener(fi.type, fi.listener);
            });
            this.listenerArr.Clear();
        }
    }

    // public LocalX(globalX: number): number {
    //     return this.globalToLocal(globalX, 0).x;
    // }

    // public LocalY(globalY: number): number {
    //     return this.globalToLocal(0, globalY).y;
    // }

    public get globalX(): number {
        if (NForm.stageX > 0) {
            //ipad
            return this.localToGlobal(0, 0).x / NForm.stageScale - NForm.stageX / NForm.stageScale;
        } else {
            return this.localToGlobal(0, 0).x;
        }
    }

    public get globalY(): number {
        if (NForm.stageX > 0) {
            //ipad
            return this.localToGlobal(0, 0).y / NForm.stageScale;
        } else {
            return this.localToGlobal(0, 0).y - NForm.stageY;
        }
    }

    public set scale(val: Vector2) {
        this.scaleX = 0.01 * val.x;
        this.scaleY = 0.01 * val.y;
        this.ResetWidthHeight();
    }

    public get display(): boolean {
        return this.visible;
    }

    public set display(val: boolean) {
        this.visible = val;
    }

    public Show(): void {
        if (this.followSx && !this.followSx.visible) {
            return;
        }
        this.visible = true;
    }

    public Hide(): void {
        this.visible = false;
    }

    public _top: any;
    public get tops(): any {
        if (this._top) {
            return this._top;
        } else if (this.parent && this.parent instanceof Sx) {
            return (this.parent as Sx).tops;
        } else if (this.parent && this.parent.parent && this.parent.parent instanceof Sx) {
            return (this.parent.parent as Sx).tops;
        }
        return null;
    }

    public _x: number = 0;
    public get x(): number {
        return this._x;
    }

    public set x(val: number) {
        this.SxSetX(val);
    }

    public SxSetX(val: number) {
        this._x = val;
        super.$setX(val);
        if (this.OnPosList) {
            this.OnPosList.Each(((fi) => {
                try {
                    fi(this.x, this.y);
                } catch (ex) {
                    Js.Trace(ex);
                }
            }).bind(this));
        }
    }

    public _y: number = 0;
    public get y(): number {
        return this._y;
    }

    public set y(val: number) {
        this.SxSetY(val);
    }

    public SxSetY(val: number) {
        this._y = val;
        super.$setY(val);
        if (this.OnPosList) {
            this.OnPosList.Each(((fi) => {
                fi(this.x, this.y);
            }).bind(this));
        }
    }

    public get position(): Vector2 {
        return new Vector2(this._x, this._y);
    }

    public set position(val: Vector2) {
        this.Pos(val.x, val.y);
    }

    public Pos(x: number, y: number): Ix {
        if (this.parent == null) {
            if (this.x != x) {
                this.x = x;
            }
            if (this.y != y) {
                this.y = y;
            }
        } else {
            if (this.x != x || this.y != y) {
                //Form.LazyCall(this,{ x: val.x,y: val.y });
                this.x = x;
                this.y = y;
            }
        }
        return this;
    }

    public Scale(x: number, y: number): Ix {
        this.scale = new Vector2(x, y);
        return this;
    }

    public PutCenter(): void {
        super.$setX(this._x - this.width / 2);
    }

    public PutRight(): void {
        super.$setX(this._x - this.width);
    }

    private OnPosList: Arr<Function>;
    public OnPos(func: Function): void {
        if (this.OnPosList == null) {
            this.OnPosList = new Arr<Function>();
        }
        this.OnPosList.Add(func);
    }

    public OnPosSplice(func: Function): void {
        this.OnPosList.Remove(func);
    }

    public RemoveMe(): void {
        try {
            if (!this.disposed) {
                if (this.parent) {
                    let p = this.parent;
                    this.parent.removeChild(this);
                } else {
                    if (this.autoDispose) {
                        this.Dispose();
                    }
                }
            }
        } catch (ex) {
            Js.Trace(ex);
        }
    }

    public get topVisible(): boolean {
        if (!this.visible) {
            return false;
        }
        if (this.parent && this.parent instanceof Sx) {
            return (this.parent as Sx).topVisible;
        }
        if (this.parent) {
            if (this.parent.parent && this.parent.parent instanceof Sx) {
                return (this.parent.parent as Sx).topVisible;
            }
        }
        if (this.parent) {
            if (this.parent instanceof egret.Stage) {
                return true;
            } else {
                return this.parent.visible;
            }
        }
        return false;
    }

    // public get Top(): Ix {
    //     if (this.parent && this.parent instanceof Sx) {
    //         return (this.parent as Sx).Top;
    //     }
    //     return null;
    // }

    private onDisposeList: Arr<Function>;
    public OnDispose(func: Function): void {
        if (this.onDisposeList == null) {
            this.onDisposeList = new Arr<Function>();
        }
        this.onDisposeList.Add(func);
    }

    private static OnRemove(ev: egret.Event): void {
        if (ev.currentTarget == ev.target) {
            if (ev.target instanceof Sx && ev.target.autoDispose) {
                ev.target.Dispose();
            }
        }
    }

    private onShowList: Arr<Function>;
    public OnShow(func: Function): void {
        if (this.onShowList == null) {
            this.onShowList = new Arr<Function>();
        }
        this.onShowList.Add(func);
    }

    private onHideList: Arr<Function>;
    public OnHide(func: Function): void {
        if (this.onHideList == null) {
            this.onHideList = new Arr<Function>();
        }
        this.onHideList.Add(func);
    }

    public OnShowSplice(func: Function): void {
        this.onShowList.Remove(func);
    }

    public OnHideSplice(func: Function): void {
        this.onHideList.Remove(func);
    }

    private _visible: boolean = true;
    public get visible(): boolean {
        return this._visible;
    }

    public set visible(val: boolean) {
        this._visible = val;
        super.$setVisible(val);
        if (val) {
            if (this.onShowList) {
                this.onShowList.Each((fi: Function) => {
                    try {
                        fi();
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                });
            }
        } else {
            if (this.onHideList) {
                this.onHideList.Each((fi: Function) => {
                    try {
                        fi();
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                });
            }
        }
    }

    public To(stateTo: any, time: number = 1000, func: Function = null, parseHandle: Function = null): any {
        return ActLite.To(this, stateTo, time, func, parseHandle);
    }

    public ToPath(stateTo: any, func: Function = null, parseHandle: Function = null): any {
        let index: number = 0;
        let nextFunc: Function = () => {
            if (index >= stateTo.length) {
                nextFunc = null;
                if (func) {
                    func();
                }
            } else {
                let item: any = stateTo[index];
                index++;
                let time: number = item["time"];
                delete item["time"];
                this.To(item, time, () => {
                    nextFunc();
                }, parseHandle);
            }
        };
        nextFunc();
    }

    private OnLoadList: Arr<Function>;
    public CallLoad(): void {
        if (!this.disposed) {
            if (this.OnLoadList) {
                this.OnLoadList.Each((fi) => {
                    try {
                        fi();
                    } catch (ex) {
                        Js.Trace(ex);
                    }
                });
            }
        }
    }

    public OnLoaded(func: Function): void {
        if (this.OnLoadList == null) {
            this.OnLoadList = new Arr<Function>();
        }
        this.OnLoadList.Add(func);
    }

    private followSx: any;
    public Follow(sx: any, offsetX: any = null, offsetY: any = null, delay: number = 0, followDispose: boolean = true, followVisible: boolean = true): void {
        this.followSx = sx;
        if (offsetX == null) {
            offsetX = 0;
        }
        if (offsetY == null) {
            offsetY = 0;
        }
        sx.OnPos((x: number, y: number) => {
            if (delay > 0) {
                NForm.SetTimeout(delay, () => {
                    if (offsetX instanceof Function) {
                        this.x = offsetX(x);
                    } else {
                        this.x = x + offsetX;
                    }
                    if (offsetY instanceof Function) {
                        this.y = offsetY(y);
                    } else {
                        this.y = y + offsetY;
                    }
                });
            } else {
                if (offsetX instanceof Function) {
                    this.x = offsetX(x);
                } else {
                    this.x = x + offsetX;
                }
                if (offsetY instanceof Function) {
                    this.y = offsetY(y);
                } else {
                    this.y = y + offsetY;
                }
            }
        });
        if (offsetX instanceof Function) {
            this.x = offsetX(sx.x);
        } else {
            this.x = sx.x + offsetX;
        }
        if (offsetY instanceof Function) {
            this.y = offsetY(sx.y);
        } else {
            this.y = sx.y + offsetY;
        }
        if (followDispose) {
            sx.OnDispose(() => {
                this.Dispose();
            });
        }
        if (followVisible) {
            sx.OnShow(() => {
                this.Show();
            });
            sx.OnHide(() => {
                this.Hide();
            });
            if (sx.visible) {
                this.Show();
            } else {
                this.Hide();
            }
        }
    }

    public static _tipFunc: Function;
    public static set TipFunc(func: Function) {
        this._tipFunc = func;
    }

    public static get TipFunc(): Function {
        return this._tipFunc;
    }

    public Tip(text: any, func: Function = null, sprite: any = null): void {
        if (Sx.TipFunc) {
            NForm.LazyCall(() => {
                Sx.TipFunc(this, text, func, sprite);
            });
        }
    }

    public disposed: boolean = false;

    public __width: number = -1;
    public Width(): number {
        if (this.__width < 0) {
            this.__width = super.$getWidth();
        }
        return this.__width;
    }
    public get width(): number {
        return this.Width();
    }

    public set width(val: number) {
        super.$setWidth(val);
        this.ResetWidthHeight();
    }

    public __height: number = -1;
    public Height(): number {
        if (this.__height < 0) {
            this.__height = super.$getHeight();
        }
        return this.__height;
    }
    public get height(): number {
        return this.Height();
    }

    public set height(val: number) {
        super.$setHeight(val);
        this.ResetWidthHeight();
    }

    public ResetWidthHeight(): void {
        this.__width = -1;
        this.__height = -1;
        if (this.parent && this.parent.hasOwnProperty("ResetWidthHeight")) {
            Object(parent).ResetWidthHeight();
        }
        this.measure();
    }

    public RemoveAll(): void {
        for (let i = this.numChildren - 1; i >= 0; i--) {
            try {
                let child: any = this.getChildAt(i);
                if (child instanceof Sx) {
                    if (!(child).disposed) {
                        if ((child).base) {
                            continue;
                        }
                    }
                }
                this.removeChildAt(i);
            } catch (ex) { }
        }
    }

    public _mouseChildren: boolean = true;
    public get mouseChildren(): boolean {
        return this._mouseChildren;
    }

    public set mouseChildren(val: boolean) {
        this._mouseChildren = val;
        this.touchChildren = val;
    }

    public _mouseEnabled: boolean = true;
    public get mouseEnabled(): boolean {
        return this._mouseEnabled;
    }

    public set mouseEnabled(val: boolean) {
        this._mouseEnabled = val;
        this.touchEnabled = val;
        this.touchThrough = !val;
    }

    private _align: number = 0;
    public get align(): number {
        return this._align;
    }

    public set align(val: number) {
        if (val == 1) {
            this.PutCenter();
        } else if (val == 2) {
            this.PutRight();
        }
        this._align = val;
    }

    public _filters: Array<any> = null;
    // public get filters(): Array<any> {//不能用这一句，然会滤镜会报错
    //     return this._filters;
    // }

    public set filters(val: Array<any>) {
        this._filters = val;
        for (let i = 0, len = this.numChildren; i < len; i++) {
            this.getChildAt(i).filters = val;
        }
    }

    private sxInfo: Listx;
    public GetTemp(key: string): any {
        if (this.sxInfo == null) {
            return 0;
        }
        return this.sxInfo[key];
    }

    public SetTemp(key: string, val: any) {
        if (this.sxInfo == null) {
            this.sxInfo = new Listx();
        }
        this.sxInfo[key] = val;
    }

    public static RegisterGuideFunc;
    public RegisterGuide(guide: string, step: number = 0) {
        if (Sx.RegisterGuideFunc) {
            Sx.RegisterGuideFunc(this, guide, step);
        }
    }
}

window["Sx"] = Sx;