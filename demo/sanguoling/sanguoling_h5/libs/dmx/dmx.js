var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
///<reference path="Strx.ts" />
var Dictionary = (function (_super) {
    __extends(Dictionary, _super);
    function Dictionary() {
        var _this = _super.call(this) || this;
        _this._risingChanged = false;
        _this._length = -1;
        _this._gsKey = new egret.HashObject();
        return _this;
    }
    Dictionary.prototype.CreateGSS = function (keys) {
        var _this = this;
        if (keys) {
            for (var fi in keys) {
                this.CreateGS(fi);
            }
        }
        else {
            this.EachKey((function (fi) {
                _this.CreateGS(fi);
            }).bind(this));
        }
    };
    Dictionary.prototype.CreateGS = function (key) {
        if (!this._gsKey[key]) {
            this._gsKey[key] = true;
            if (this._xml) {
            }
            else {
                this["_" + key] = this[key];
                delete this[key];
            }
            Object.defineProperty(this, key, {
                set: function (val) {
                    // if (key instanceof Function) {
                    //     key = Strx.Rnd(Number.MAX_VALUE).toString();
                    // }
                    this._risingChanged = false;
                    if (this._xml) {
                        if (this.Exists(key)) {
                            var oldVal = this._xml[key];
                            if (oldVal != val || val == null) {
                                this._xml[key] = val;
                                this.Changed(key, oldVal, val);
                                this.ResetLength();
                            }
                        }
                        else {
                            this._xml[key] = val;
                            this.Changed(key, null, val);
                            this.ResetLength();
                        }
                    }
                    else {
                        if (this.Exists(key)) {
                            var oldVal = this["_" + key];
                            if (oldVal != val || val == null) {
                                this["_" + key] = val;
                                this.Changed(key, oldVal, val);
                                this.ResetLength();
                            }
                        }
                        else {
                            this["_" + key] = val;
                            this.Changed(key, null, val);
                            this.ResetLength();
                        }
                    }
                },
                get: function () {
                    var val = null;
                    if (this._xml) {
                        val = this._xml[key];
                        if (Strx.IsEmpty(val)) {
                            return "";
                        }
                    }
                    else {
                        val = this["_" + key];
                        if (val) {
                            if (val instanceof Function) {
                                return val;
                            }
                        }
                        if (Strx.IsEmpty(val)) {
                            return "";
                        }
                    }
                    return val;
                }
            });
        }
    };
    Dictionary.prototype.s = function (key, val) {
        this.Set(key, val);
    };
    Dictionary.prototype.Set = function (key, val) {
        this._risingChanged = false;
        if (key instanceof Function) {
            key = Strx.Rnd(Number.MAX_VALUE).toString();
        }
        if (this.Exists(key)) {
            var oldVal = this.Get(key);
            if (oldVal != val || val == null) {
                this[key] = val;
                this.Changed(key, oldVal, val);
                this.ResetLength();
            }
        }
        else {
            this[key] = val;
            this.Changed(key, null, val);
            this.ResetLength();
        }
    };
    Dictionary.prototype.g = function (key) {
        return this.Get(key);
    };
    Dictionary.prototype.Get = function (key) {
        if (this._xml) {
            return this._xml[key];
        }
        else {
            return this[key];
        }
    };
    Dictionary.prototype.Remove = function (key) {
        if (!Dictionary.systemKeys.hasOwnProperty(key)) {
            delete this[key];
            delete this["_" + key];
            this.ResetLength();
        }
    };
    Dictionary.prototype.Clear = function () {
        var _this = this;
        // for (let fi in this) {
        //     Js.Trace(fi);
        // }
        // Js.Trace("------------------------");
        this.EachKey((function (xi) {
            // Js.Trace(xi);
            delete _this[xi];
            delete _this["_" + xi];
        }).bind(this));
        this.ResetLength();
    };
    Dictionary.prototype.Exists = function (key) {
        if (this._xml) {
            return this._xml.hasOwnProperty(key);
        }
        else {
            return this.hasOwnProperty(key);
            // let rv = false;
            // if (this.keys && this.keys.length > 0) {
            //     rv = this.keys.indexOf(key) > -1;
            // }
            // if (!rv) {
            //     rv = this.hasOwnProperty(key);
            // }
            // return rv;
        }
    };
    Dictionary.prototype.GetOrAdd = function (key, func) {
        if (this.Exists(key)) {
            return this.g(key);
        }
        else {
            var rv = func();
            this.s(key, rv);
            return rv;
        }
    };
    Dictionary.prototype.GetName = function (index) {
        var rv = null;
        var i = 0;
        this.EachKey(function (fi) {
            if (i == index) {
                rv = fi;
                return true;
            }
            i++;
        });
        return rv;
    };
    Dictionary.prototype.GetValue = function (index) {
        var key = this.GetName(index);
        return this.g(key);
    };
    Dictionary.prototype.GetIndex = function (key) {
        var rv = -1;
        var i = 0;
        this.EachKey(function (fi) {
            if (fi == key) {
                rv = i;
                return true;
            }
            i++;
        });
        return rv;
    };
    Dictionary.prototype.EachKey = function (func) {
        if (this._xml) {
            for (var fi in this._xml) {
                if (func(fi)) {
                    break;
                }
            }
        }
        else {
            // if (this.keys.length > 0) {
            //     this.keys.forEach((fi) => {
            //         if (fi.IsFull()) {
            //             if (fi.substr(0, 1) == "_") {
            //                 fi = fi.substr(1, fi.length - 1);
            //             }
            //             if (func(fi)) {
            //             }
            //         }
            //     });
            // } else {//暂时注释了，加上后可能会出莫名的问题
            for (var fi in this) {
                if (fi.IsFull() && !Dictionary.systemKeys.hasOwnProperty(fi) && fi.substr(0, 1) != "_") {
                    if (func(fi)) {
                        break;
                    }
                }
            }
            //}
        }
    };
    Dictionary.prototype.Each = function (func) {
        if (this._xml) {
            for (var fi in this._xml) {
                if (fi) {
                    if (func(this._xml[fi])) {
                        break;
                    }
                }
            }
        }
        else {
            for (var fi in this) {
                if (fi) {
                    if (!Dictionary.systemKeys.hasOwnProperty(fi)) {
                        if (func(this[fi])) {
                            break;
                        }
                    }
                }
            }
        }
    };
    Dictionary.prototype.ResetLength = function () {
        this._length = -1;
    };
    Object.defineProperty(Dictionary.prototype, "length", {
        get: function () {
            if (this._length < 0) {
                this._length = 0;
                if (this._xml) {
                    for (var fi in this._xml) {
                        this._length++;
                    }
                }
                else {
                    for (var fi in this) {
                        if (!Dictionary.systemKeys.hasOwnProperty(fi)) {
                            this._length++;
                        }
                    }
                }
            }
            return this._length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "Length", {
        get: function () {
            return this.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "keys", {
        get: function () {
            var keys = new Array();
            if (this._xml) {
                for (var fi in this._xml) {
                    keys.push(fi);
                }
            }
            else {
                for (var fi in this) {
                    if (!Dictionary.systemKeys.hasOwnProperty(fi)) {
                        keys.push(fi);
                    }
                }
            }
            return keys;
        },
        enumerable: true,
        configurable: true
    });
    Dictionary.prototype.Dispose = function () {
        if (this._changedFuncList) {
            this._changedFuncList.Clear();
            this._changedFuncList = null;
        }
    };
    Object.defineProperty(Dictionary.prototype, "changedFuncList", {
        get: function () {
            if (this._changedFuncList == null) {
                this._changedFuncList = new Arr();
            }
            return this._changedFuncList;
        },
        enumerable: true,
        configurable: true
    });
    Dictionary.prototype.Changed = function (key, oldValue, newValue) {
        var _this = this;
        if (this._risingChanged) {
            return;
        }
        this._risingChanged = true;
        if (this._changedFuncList && this._changedFuncList.length > 0) {
            this._changedFuncList.Each(function (fi) {
                try {
                    if (fi) {
                        fi(key, oldValue, newValue, _this);
                    }
                    else {
                        Js.Trace("Error:Changed func fi empty");
                    }
                }
                catch (ex) {
                    Js.Trace(ex);
                }
            });
        }
    };
    Dictionary.systemKeys = {
        _xml: true,
        $hashCode: true,
        hashCode: true,
        __class__: true,
        __types__: true,
        _gsKey: true,
        Remove: true,
        _length: true,
        constructor: true,
        CreateGS: true,
        CreateGSS: true,
        s: true,
        Set: true,
        g: true,
        Get: true,
        Clear: true,
        Exists: true,
        GetName: true,
        GetValue: true,
        GetIndex: true,
        EachKey: true,
        Each: true,
        ResetLength: true,
        length: true,
        Length: true,
        keys: true,
        Dispose: true,
        _changedFuncList: true,
        changedFuncList: true,
        Changed: true,
        _staticData: true,
        Listen: true,
        ListenArray: true,
        Text: true,
        CopyTo: true,
        GetPageSize: true,
        GetPage: true,
        Take: true,
        Where: true,
        Copy: true,
        Count: true,
        Any: true,
        RemoveAll: true,
        All: true,
        FirstOrDefault: true,
        Max: true,
        Min: true,
        MaxItem: true,
        toString: true,
        setProperty: true,
        GetOrAdd: true,
        _parent: true,
        Parent: true,
        _sortDesc: true,
        _sortKey: true,
        _names: true,
        DoChanged: true,
        ItemDoChanged: true,
        OnAdd: true,
        OnRemove: true,
        OnChanged: true,
        OnAddSplice: true,
        OnRemoveSplice: true,
        OnChangedSplice: true,
        ListenEmpty: true,
        Sum: true,
        Select: true,
        ToArray: true,
        OrderBy: true,
        GroupBy: true,
        Add: true,
        AddKey: true,
        //index: true,
        _risingChanged: true,
        OnListAddList: true,
        OnRemoveList: true,
        undefined: true,
        OnChangedList: true,
        Reverse: true,
    };
    return Dictionary;
}(egret.HashObject));
__reflect(Dictionary.prototype, "Dictionary");
window["Dictionary"] = Dictionary;
///<reference path="Js.ts" />
var Sx = (function (_super) {
    __extends(Sx, _super);
    function Sx() {
        var _this = _super.call(this) || this;
        _this.that = _this; //设that = this
        _this.showTop50 = false; //设置布尔型
        _this.base = false; //true后将不会被removeall
        _this.isLoaded = false;
        _this.guideX = 0;
        _this.guideY = 0;
        _this.guidePos = 0;
        _this.warn = true;
        _this.sxIndex = 0;
        _this.showTipWarn = true;
        _this.continueGuide = false;
        _this._depth = 0;
        _this.graphicsed = false;
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
        _this.checkEventAlpha = false;
        ////////////////////////////////
        _this.autoDispose = true;
        _this._x = 0;
        _this._y = 0;
        _this._visible = true;
        _this.disposed = false;
        _this.__width = -1;
        _this.__height = -1;
        _this._mouseChildren = true;
        _this._mouseEnabled = true;
        _this._align = 0;
        _this._filters = null;
        Sx.index++;
        _this.sxIndex = Sx.index;
        _this.addEventListenerSx(egret.Event.REMOVED, Sx.OnRemove);
        _this.touchEnabled = false;
        try {
            if (_this.warn && Js) {
                if (Js.showTrace) {
                    NForm.SetTimeout(100, function () {
                        if (_this.warn) {
                            if (!_this.disposed && _this.parent == null) {
                                Js.Trace("Out Sx: " + _this.sxIndex);
                                Js.Trace(_this);
                                //this.Dispose();
                            }
                        }
                    });
                }
            }
        }
        catch (ex) { }
        return _this;
    }
    Sx.prototype.SetAutoHide = function (showTop50) {
        if (showTop50 === void 0) { showTop50 = false; }
        this.showTop50 = showTop50;
        NForm.AddHandleAutoHide(this);
    };
    Object.defineProperty(Sx.prototype, "depth", {
        get: function () {
            return this._depth;
        },
        set: function (val) {
            var _this = this;
            this._depth = val;
            if (this.parent) {
                var cs = this.parent.$children.sort(function (a, b) {
                    var a1 = a;
                    var b1 = b;
                    return a1._depth - b1._depth;
                });
                var index_1 = 0;
                cs.forEach((function (fi) {
                    _this.parent.setChildIndex(fi, index_1);
                    index_1++;
                }).bind(this));
            }
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.HandleAutoHide_Hide = function () {
        this.visible = false;
    };
    Sx.prototype.HandleAutoHide_Show = function () {
        this.visible = true;
    };
    Sx.prototype.HandleAutoHide = function () {
        if (this.disposed) {
            return false;
        }
        if (this.visible) {
            var x = this.globalX;
            if (x < -Sx.autoHideOffset || x > NForm.width + Sx.autoHideOffset) {
                this.HandleAutoHide_Hide();
                return false;
            }
            var y = this.globalY;
            if (y < -Sx.autoHideOffset || y > NForm.height + Sx.autoHideOffset) {
                this.HandleAutoHide_Hide();
                return false;
            }
            return true;
        }
        else {
            var x = this.globalX;
            var y = this.globalY;
            if (x >= -Sx.autoHideOffset && x <= NForm.width + Sx.autoHideOffset && y >= -Sx.autoHideOffset && y <= NForm.height + Sx.autoHideOffset) {
                this.HandleAutoHide_Show();
                return true;
            }
            return false;
        }
    };
    Sx.prototype.Add = function (s2, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (!this.disposed) {
            if (s2 == null) {
                return false;
            }
            var s = null;
            if (typeof s2 == "string") {
                s = Assert.Img(s2);
            }
            else {
                s = s2;
            }
            if (x != 0) {
                s.x = x;
            }
            if (y != 0) {
                s.y = y;
            }
            if (s instanceof Sx) {
                if (s.disposed) {
                    Js.TraceDmx("disposed obj added");
                    return false;
                }
            }
            this.addChild(s);
            if (s instanceof Sx) {
                var s1 = (s);
                if (s1.depth != Number.MIN_VALUE) {
                    for (var i = this.numChildren - 1; i >= 0; i--) {
                        var child1 = this.getChildAt(i);
                        if (child1 instanceof Sx && !child1.disposed) {
                            var child = (child1);
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
            }
            else if (s.align == 2) {
                s.PutRight();
            }
            return true;
        }
        else {
            if (s2 instanceof Sx) {
                s2.Dispose();
            }
            else if (s2 instanceof Bx) {
                s2.Dispose();
            }
        }
        return false;
    };
    Sx.prototype.LazyAdd = function (s) {
        var _this = this;
        NForm.LazyCall(function () {
            if (!_this.disposed) {
                _this.Add(s, 0, 0);
            }
        });
    };
    Sx.prototype.Remove = function (item) {
        if (item) {
            try {
                item.RemoveMe();
            }
            catch (ex) {
                Js.Trace(ex);
            }
        }
    };
    Sx.prototype.RemoveDisplayObject = function (item) {
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
                    item.graphics.clear();
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
        }
    };
    Object.defineProperty(Sx.prototype, "buttonMode", {
        set: function (val) {
            this.touchEnabled = true;
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.Dispose = function () {
        if (!this.disposed) {
            this.disposed = true;
            if (this.graphicsed) {
                this.DrawClear();
            }
            this.clearEventListener();
            this.listenerArr = null;
            if (this.onDisposeList) {
                var OnDisposeList = this.onDisposeList;
                this.onDisposeList = null;
                OnDisposeList.Each(function (fi) {
                    try {
                        fi();
                    }
                    catch (ex) {
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
            for (var i = this.numChildren - 1; i >= 0; i--) {
                try {
                    var child = this.getChildAt(i);
                    this.removeChild(child);
                }
                catch (ex) { }
            }
            //            for(let fi in this) {
            //                delete this[fi]
            //            }
        }
    };
    Sx.prototype.IsBG = function () {
        this.touchEnabled = true;
    };
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
    Sx.prototype.SetupGraphics = function () {
        if (this.graphics == null) {
            this.graphicsed = true;
            this.graphics = new egret.Shape();
            this.Add(this.graphics);
        }
    };
    ;
    Sx.prototype.DrawRect = function (x, y, width, height, color, alpha) {
        this.SetupGraphics();
        this.graphics.graphics.beginFill(color, alpha);
        this.graphics.graphics.drawRect(x, y, width, height);
        this.graphics.graphics.endFill();
    };
    Sx.prototype.DrawRoundRect = function (x, y, width, height, colors, alphas, ellipse) {
        this.SetupGraphics();
        if (colors.length == 1) {
            this.graphics.graphics.beginFill(colors[0], alphas[0]);
        }
        else {
            var matrix = new egret.Matrix();
            matrix.createGradientBox(width, height, Math.PI * 0.5, x, y);
            if (alphas.length < colors.length) {
                for (var i = 0, len = colors.length; i < len; i++) {
                    alphas[i] = 1;
                }
            }
            this.graphics.graphics.beginGradientFill(egret.GradientType.LINEAR, colors, alphas, [0, 255], matrix);
        }
        this.graphics.graphics.drawRoundRect(x, y, width, height, ellipse, ellipse);
        this.graphics.graphics.endFill();
    };
    Sx.prototype.DrawLine = function (x1, y1, x2, y2, lineHeight, color, alpha) {
        this.SetupGraphics();
        this.graphics.graphics.lineStyle(lineHeight, color, alpha);
        this.graphics.graphics.moveTo(x1, y1);
        this.graphics.graphics.lineTo(x2, y2);
    };
    Sx.prototype.DrawArc = function (x, y, radius, fromAngle, endAngle, colors, alphas) {
        this.SetupGraphics();
        if (colors.length == 1) {
            this.graphics.graphics.beginFill(colors[0], alphas[0]);
        }
        else {
            var matrix = new egret.Matrix();
            matrix.createGradientBox(radius, radius, Math.PI * 0.5, x, y);
            if (alphas.length < colors.length) {
                for (var i = 0, len = colors.length; i < len; i++) {
                    alphas[i] = 1;
                }
            }
            this.graphics.graphics.beginGradientFill(egret.GradientType.LINEAR, colors, alphas, [0, 255], matrix);
        }
        this.DrawFan(radius, Math.PI * fromAngle / 180, Math.PI * endAngle / 180);
        this.graphics.graphics.endFill();
    };
    Sx.prototype.DrawCircle = function (x, y, radius, colors, alphas) {
        this.SetupGraphics();
        if (colors.length == 1) {
            this.graphics.graphics.beginFill(colors[0], alphas[0]);
        }
        else {
            var matrix = new egret.Matrix();
            matrix.createGradientBox(radius, radius, Math.PI * 0.5, x, y);
            if (alphas.length < colors.length) {
                for (var i = 0, len = colors.length; i < len; i++) {
                    alphas[i] = 1;
                }
            }
            this.graphics.graphics.beginGradientFill(egret.GradientType.LINEAR, colors, alphas, [0, 255], matrix);
        }
        this.graphics.graphics.drawCircle(x, y, radius);
        this.graphics.graphics.endFill();
    };
    Sx.prototype.DrawFan = function (radius, startAngle, endAngle) {
        var unitDrawAngle = 0.12;
        var tx;
        var ty;
        var times = Math.ceil((endAngle - startAngle) / unitDrawAngle);
        var tempAngle = startAngle;
        this.graphics.graphics.lineStyle(1, 0xffffff, 1);
        this.graphics.graphics.moveTo(radius, radius);
        tx = radius * (1 + Math.cos(startAngle));
        ty = radius * (1 - Math.sin(startAngle));
        this.graphics.graphics.lineTo(tx, ty);
        while (times > 0) {
            if (times != 1) {
                tx = radius * (1 + Math.cos(tempAngle + unitDrawAngle));
                ty = radius * (1 - Math.sin(tempAngle + unitDrawAngle));
            }
            else {
                tx = radius * (1 + Math.cos(endAngle));
                ty = radius * (1 - Math.sin(endAngle));
            }
            this.graphics.graphics.lineTo(tx, ty);
            tempAngle += unitDrawAngle;
            times--;
        }
        this.graphics.graphics.lineTo(radius, radius);
    };
    Sx.prototype.DrawSixth = function (x, y, radius, borderColor, borderHeight, borderAlpha, colors, alphas) {
        this.SetupGraphics();
        if (colors.length == 1) {
            this.graphics.graphics.beginFill(colors[0], alphas[0]);
        }
        else {
            var matrix = new egret.Matrix();
            matrix.createGradientBox(radius, radius, Math.PI * 0.5, x, y);
            if (alphas.length < colors.length) {
                for (var i = 0, len = colors.length; i < len; i++) {
                    alphas[i] = 1;
                }
            }
            this.graphics.graphics.beginGradientFill(egret.GradientType.LINEAR, colors, alphas, [0, 255], matrix);
        }
        //////////////////
        var unitDrawAngle = 60;
        var startAngle = 0;
        var endAngle = 360;
        var tx;
        var ty;
        var times = 6;
        var tempAngle = startAngle;
        this.graphics.graphics.lineStyle(borderHeight, borderColor, borderAlpha);
        for (var i = 0; i <= 6; i++) {
            var angle = 30 + 360 * i / 6;
            tx = x + radius * Math.cos(angle * (3.1415926 / 180));
            ty = y + radius * Math.sin(angle * (3.1415926 / 180));
            if (i == 0) {
                this.graphics.graphics.moveTo(tx, ty);
            }
            else {
                this.graphics.graphics.lineTo(tx, ty);
            }
        }
        //////////////////
        this.graphics.graphics.endFill();
    };
    Sx.prototype.DrawClear = function () {
        if (this.graphics) {
            this.graphics.graphics.clear();
        }
    };
    Object.defineProperty(Sx, "clickEvent", {
        get: function () {
            //Sx._clickEvent.localX = 0;
            //Sx._clickEvent.localY = 0;
            return Sx._clickEvent;
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.Click = function (func) {
        var _this = this;
        this.addEventListenerSx(egret.TouchEvent.TOUCH_TAP, function (ev) {
            try {
                var now = new Date();
                var ts = now.getTime() - NForm.downDt.getTime();
                if (ts >= 1500) {
                    return;
                }
                if (_this["hitAreaRect"]) {
                    var stageX = ev.stageX;
                    var stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= _this.globalX + _this["hitAreaRect"]["x"] && stageX <= _this.globalX + _this["hitAreaRect"]["x"] + _this["hitAreaRect"].width) {
                        if (stageY >= _this.globalY + _this["hitAreaRect"]["y"] && stageY <= _this.globalY + _this["hitAreaRect"]["y"] + _this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                }
                else {
                    try {
                        func(ev);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
        });
    };
    Sx.prototype.DblClick = function (func) {
        //this.doubleClickEnabled = true;//TODO;
    };
    Sx.prototype.Over = function (func) {
        var _this = this;
        this.addEventListenerSx(egret.TouchEvent.TOUCH_BEGIN, function (ev) {
            try {
                if (_this["hitAreaRect"]) {
                    var stageX = ev.stageX;
                    var stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= _this.globalX + _this["hitAreaRect"]["x"] && stageX <= _this.globalX + _this["hitAreaRect"]["x"] + _this["hitAreaRect"].width) {
                        if (stageY >= _this.globalY + _this["hitAreaRect"]["y"] && stageY <= _this.globalY + _this["hitAreaRect"]["y"] + _this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                }
                else {
                    try {
                        func(ev);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
        });
    };
    Sx.prototype.OutAndUp = function (func) {
        var _this = this;
        this.addEventListenerSx(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function (ev) {
            try {
                if (_this["hitAreaRect"]) {
                    var stageX = ev.stageX;
                    var stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= _this.globalX + _this["hitAreaRect"]["x"] && stageX <= _this.globalX + _this["hitAreaRect"]["x"] + _this["hitAreaRect"].width) {
                        if (stageY >= _this.globalY + _this["hitAreaRect"]["y"] && stageY <= _this.globalY + _this["hitAreaRect"]["y"] + _this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                }
                else {
                    try {
                        func(ev);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
        });
    };
    Sx.prototype.Move = function (func) {
        var _this = this;
        this.addEventListenerSx(egret.TouchEvent.TOUCH_MOVE, function (ev) {
            try {
                if (_this["hitAreaRect"]) {
                    var stageX = ev.stageX;
                    var stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= _this.globalX + _this["hitAreaRect"]["x"] && stageX <= _this.globalX + _this["hitAreaRect"]["x"] + _this["hitAreaRect"].width) {
                        if (stageY >= _this.globalY + _this["hitAreaRect"]["y"] && stageY <= _this.globalY + _this["hitAreaRect"]["y"] + _this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                }
                else {
                    try {
                        func(ev);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
        });
    };
    Sx.prototype.Down = function (func) {
        var _this = this;
        this.addEventListenerSx(egret.TouchEvent.TOUCH_BEGIN, function (ev) {
            try {
                if (_this["hitAreaRect"]) {
                    var stageX = ev.stageX;
                    var stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= _this.globalX + _this["hitAreaRect"]["x"] && stageX <= _this.globalX + _this["hitAreaRect"]["x"] + _this["hitAreaRect"].width) {
                        if (stageY >= _this.globalY + _this["hitAreaRect"]["y"] && stageY <= _this.globalY + _this["hitAreaRect"]["y"] + _this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                }
                else {
                    try {
                        func(ev);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
        });
    };
    Sx.prototype.Up = function (func) {
        var _this = this;
        this.addEventListenerSx(egret.TouchEvent.TOUCH_END, function (ev) {
            try {
                if (_this["hitAreaRect"]) {
                    var stageX = ev.stageX;
                    var stageY = ev.stageY;
                    if (NForm.NARROW) {
                        stageY += NForm.stageHeightOffset / 2;
                    }
                    else if (NForm.WIDE) {
                        stageY = stageY / NForm.stageScale;
                    }
                    if (stageX >= _this.globalX + _this["hitAreaRect"]["x"] && stageX <= _this.globalX + _this["hitAreaRect"]["x"] + _this["hitAreaRect"].width) {
                        if (stageY >= _this.globalY + _this["hitAreaRect"]["y"] && stageY <= _this.globalY + _this["hitAreaRect"]["y"] + _this["hitAreaRect"].height) {
                            func(ev);
                        }
                    }
                }
                else {
                    try {
                        func(ev);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
        });
    };
    Sx.prototype.Flatten = function () {
    };
    Sx.prototype.UnFlatten = function () {
    };
    Sx.prototype.SetChildrenMouseDisabled = function () {
        this.touchEnabled = false;
        this.touchChildren = false;
        return this;
    };
    Sx.prototype.SetChildrenMouseEnabled = function () {
        this.touchEnabled = true;
        this.touchChildren = true;
        return this;
    };
    Sx.prototype.SetHitArea = function (rect, show, inner) {
        if (show === void 0) { show = false; }
        if (inner === void 0) { inner = false; }
        var hit = new egret.Shape();
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
    };
    Sx.prototype.addEventListenerSx = function (type, listener, u, p, w) {
        if (u === void 0) { u = false; }
        if (p === void 0) { p = 0; }
        if (w === void 0) { w = false; }
        this.addEventListener(type, listener, this, u, p);
        if (this.listenerArr == null) {
            this.listenerArr = new Arr();
        }
        var obj = { type: type, listener: listener };
        this.listenerArr.Add(obj);
        if (type != egret.Event.REMOVED) {
            this.mouseEnabled = true;
        }
    };
    Sx.prototype.removeEventListenerSx = function (type, listener, u) {
        if (u === void 0) { u = false; }
        this.removeEventListener(type, listener, this);
        if (this.listenerArr) {
            this.listenerArr.Clear();
            for (var i = 0, len = this.listenerArr.length; i < len; i++) {
                var fi = this.listenerArr[i];
                if (fi.type == type && fi.listener == listener) {
                    this.listenerArr.removeItemAt(i);
                    break;
                }
            }
        }
    };
    Sx.prototype.onlyRemoveEventListener = function (type, listener, u) {
        if (u === void 0) { u = false; }
        _super.prototype.removeEventListener.call(this, type, listener, this);
    };
    Sx.prototype.clearEventListener = function () {
        var _this = this;
        if (this.listenerArr && this.listenerArr.length > 0) {
            this.listenerArr.Each(function (fi) {
                _this.onlyRemoveEventListener(fi.type, fi.listener);
            });
            this.listenerArr.Clear();
        }
    };
    Object.defineProperty(Sx.prototype, "globalX", {
        // public LocalX(globalX: number): number {
        //     return this.globalToLocal(globalX, 0).x;
        // }
        // public LocalY(globalY: number): number {
        //     return this.globalToLocal(0, globalY).y;
        // }
        get: function () {
            if (NForm.stageX > 0) {
                //ipad
                return this.localToGlobal(0, 0).x / NForm.stageScale - NForm.stageX / NForm.stageScale;
            }
            else {
                return this.localToGlobal(0, 0).x;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sx.prototype, "globalY", {
        get: function () {
            if (NForm.stageX > 0) {
                //ipad
                return this.localToGlobal(0, 0).y / NForm.stageScale;
            }
            else {
                return this.localToGlobal(0, 0).y - NForm.stageY;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sx.prototype, "scale", {
        set: function (val) {
            this.scaleX = 0.01 * val.x;
            this.scaleY = 0.01 * val.y;
            this.ResetWidthHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sx.prototype, "display", {
        get: function () {
            return this.visible;
        },
        set: function (val) {
            this.visible = val;
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.Show = function () {
        if (this.followSx && !this.followSx.visible) {
            return;
        }
        this.visible = true;
    };
    Sx.prototype.Hide = function () {
        this.visible = false;
    };
    Object.defineProperty(Sx.prototype, "tops", {
        get: function () {
            if (this._top) {
                return this._top;
            }
            else if (this.parent && this.parent instanceof Sx) {
                return this.parent.tops;
            }
            else if (this.parent && this.parent.parent && this.parent.parent instanceof Sx) {
                return this.parent.parent.tops;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sx.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (val) {
            this.SxSetX(val);
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.SxSetX = function (val) {
        var _this = this;
        this._x = val;
        _super.prototype.$setX.call(this, val);
        if (this.OnPosList) {
            this.OnPosList.Each((function (fi) {
                try {
                    fi(_this.x, _this.y);
                }
                catch (ex) {
                    Js.Trace(ex);
                }
            }).bind(this));
        }
    };
    Object.defineProperty(Sx.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (val) {
            this.SxSetY(val);
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.SxSetY = function (val) {
        var _this = this;
        this._y = val;
        _super.prototype.$setY.call(this, val);
        if (this.OnPosList) {
            this.OnPosList.Each((function (fi) {
                fi(_this.x, _this.y);
            }).bind(this));
        }
    };
    Object.defineProperty(Sx.prototype, "position", {
        get: function () {
            return new Vector2(this._x, this._y);
        },
        set: function (val) {
            this.Pos(val.x, val.y);
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.Pos = function (x, y) {
        if (this.parent == null) {
            if (this.x != x) {
                this.x = x;
            }
            if (this.y != y) {
                this.y = y;
            }
        }
        else {
            if (this.x != x || this.y != y) {
                //Form.LazyCall(this,{ x: val.x,y: val.y });
                this.x = x;
                this.y = y;
            }
        }
        return this;
    };
    Sx.prototype.Scale = function (x, y) {
        this.scale = new Vector2(x, y);
        return this;
    };
    Sx.prototype.PutCenter = function () {
        _super.prototype.$setX.call(this, this._x - this.width / 2);
    };
    Sx.prototype.PutRight = function () {
        _super.prototype.$setX.call(this, this._x - this.width);
    };
    Sx.prototype.OnPos = function (func) {
        if (this.OnPosList == null) {
            this.OnPosList = new Arr();
        }
        this.OnPosList.Add(func);
    };
    Sx.prototype.OnPosSplice = function (func) {
        this.OnPosList.Remove(func);
    };
    Sx.prototype.RemoveMe = function () {
        try {
            if (!this.disposed) {
                if (this.parent) {
                    var p = this.parent;
                    this.parent.removeChild(this);
                }
                else {
                    if (this.autoDispose) {
                        this.Dispose();
                    }
                }
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
    };
    Object.defineProperty(Sx.prototype, "topVisible", {
        get: function () {
            if (!this.visible) {
                return false;
            }
            if (this.parent && this.parent instanceof Sx) {
                return this.parent.topVisible;
            }
            if (this.parent) {
                if (this.parent.parent && this.parent.parent instanceof Sx) {
                    return this.parent.parent.topVisible;
                }
            }
            if (this.parent) {
                if (this.parent instanceof egret.Stage) {
                    return true;
                }
                else {
                    return this.parent.visible;
                }
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.OnDispose = function (func) {
        if (this.onDisposeList == null) {
            this.onDisposeList = new Arr();
        }
        this.onDisposeList.Add(func);
    };
    Sx.OnRemove = function (ev) {
        if (ev.currentTarget == ev.target) {
            if (ev.target instanceof Sx && ev.target.autoDispose) {
                ev.target.Dispose();
            }
        }
    };
    Sx.prototype.OnShow = function (func) {
        if (this.onShowList == null) {
            this.onShowList = new Arr();
        }
        this.onShowList.Add(func);
    };
    Sx.prototype.OnHide = function (func) {
        if (this.onHideList == null) {
            this.onHideList = new Arr();
        }
        this.onHideList.Add(func);
    };
    Sx.prototype.OnShowSplice = function (func) {
        this.onShowList.Remove(func);
    };
    Sx.prototype.OnHideSplice = function (func) {
        this.onHideList.Remove(func);
    };
    Object.defineProperty(Sx.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (val) {
            this._visible = val;
            _super.prototype.$setVisible.call(this, val);
            if (val) {
                if (this.onShowList) {
                    this.onShowList.Each(function (fi) {
                        try {
                            fi();
                        }
                        catch (ex) {
                            Js.Trace(ex);
                        }
                    });
                }
            }
            else {
                if (this.onHideList) {
                    this.onHideList.Each(function (fi) {
                        try {
                            fi();
                        }
                        catch (ex) {
                            Js.Trace(ex);
                        }
                    });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.To = function (stateTo, time, func, parseHandle) {
        if (time === void 0) { time = 1000; }
        if (func === void 0) { func = null; }
        if (parseHandle === void 0) { parseHandle = null; }
        return ActLite.To(this, stateTo, time, func, parseHandle);
    };
    Sx.prototype.ToPath = function (stateTo, func, parseHandle) {
        var _this = this;
        if (func === void 0) { func = null; }
        if (parseHandle === void 0) { parseHandle = null; }
        var index = 0;
        var nextFunc = function () {
            if (index >= stateTo.length) {
                nextFunc = null;
                if (func) {
                    func();
                }
            }
            else {
                var item = stateTo[index];
                index++;
                var time = item["time"];
                delete item["time"];
                _this.To(item, time, function () {
                    nextFunc();
                }, parseHandle);
            }
        };
        nextFunc();
    };
    Sx.prototype.CallLoad = function () {
        if (!this.disposed) {
            if (this.OnLoadList) {
                this.OnLoadList.Each(function (fi) {
                    try {
                        fi();
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                });
            }
        }
    };
    Sx.prototype.OnLoaded = function (func) {
        if (this.OnLoadList == null) {
            this.OnLoadList = new Arr();
        }
        this.OnLoadList.Add(func);
    };
    Sx.prototype.Follow = function (sx, offsetX, offsetY, delay, followDispose, followVisible) {
        var _this = this;
        if (offsetX === void 0) { offsetX = null; }
        if (offsetY === void 0) { offsetY = null; }
        if (delay === void 0) { delay = 0; }
        if (followDispose === void 0) { followDispose = true; }
        if (followVisible === void 0) { followVisible = true; }
        this.followSx = sx;
        if (offsetX == null) {
            offsetX = 0;
        }
        if (offsetY == null) {
            offsetY = 0;
        }
        sx.OnPos(function (x, y) {
            if (delay > 0) {
                NForm.SetTimeout(delay, function () {
                    if (offsetX instanceof Function) {
                        _this.x = offsetX(x);
                    }
                    else {
                        _this.x = x + offsetX;
                    }
                    if (offsetY instanceof Function) {
                        _this.y = offsetY(y);
                    }
                    else {
                        _this.y = y + offsetY;
                    }
                });
            }
            else {
                if (offsetX instanceof Function) {
                    _this.x = offsetX(x);
                }
                else {
                    _this.x = x + offsetX;
                }
                if (offsetY instanceof Function) {
                    _this.y = offsetY(y);
                }
                else {
                    _this.y = y + offsetY;
                }
            }
        });
        if (offsetX instanceof Function) {
            this.x = offsetX(sx.x);
        }
        else {
            this.x = sx.x + offsetX;
        }
        if (offsetY instanceof Function) {
            this.y = offsetY(sx.y);
        }
        else {
            this.y = sx.y + offsetY;
        }
        if (followDispose) {
            sx.OnDispose(function () {
                _this.Dispose();
            });
        }
        if (followVisible) {
            sx.OnShow(function () {
                _this.Show();
            });
            sx.OnHide(function () {
                _this.Hide();
            });
            if (sx.visible) {
                this.Show();
            }
            else {
                this.Hide();
            }
        }
    };
    Object.defineProperty(Sx, "TipFunc", {
        get: function () {
            return this._tipFunc;
        },
        set: function (func) {
            this._tipFunc = func;
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.Tip = function (text, func, sprite) {
        var _this = this;
        if (func === void 0) { func = null; }
        if (sprite === void 0) { sprite = null; }
        if (Sx.TipFunc) {
            NForm.LazyCall(function () {
                Sx.TipFunc(_this, text, func, sprite);
            });
        }
    };
    Sx.prototype.Width = function () {
        if (this.__width < 0) {
            this.__width = _super.prototype.$getWidth.call(this);
        }
        return this.__width;
    };
    Object.defineProperty(Sx.prototype, "width", {
        get: function () {
            return this.Width();
        },
        set: function (val) {
            _super.prototype.$setWidth.call(this, val);
            this.ResetWidthHeight();
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.Height = function () {
        if (this.__height < 0) {
            this.__height = _super.prototype.$getHeight.call(this);
        }
        return this.__height;
    };
    Object.defineProperty(Sx.prototype, "height", {
        get: function () {
            return this.Height();
        },
        set: function (val) {
            _super.prototype.$setHeight.call(this, val);
            this.ResetWidthHeight();
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.ResetWidthHeight = function () {
        this.__width = -1;
        this.__height = -1;
        if (this.parent && this.parent.hasOwnProperty("ResetWidthHeight")) {
            Object(parent).ResetWidthHeight();
        }
        this.measure();
    };
    Sx.prototype.RemoveAll = function () {
        for (var i = this.numChildren - 1; i >= 0; i--) {
            try {
                var child = this.getChildAt(i);
                if (child instanceof Sx) {
                    if (!(child).disposed) {
                        if ((child).base) {
                            continue;
                        }
                    }
                }
                this.removeChildAt(i);
            }
            catch (ex) { }
        }
    };
    Object.defineProperty(Sx.prototype, "mouseChildren", {
        get: function () {
            return this._mouseChildren;
        },
        set: function (val) {
            this._mouseChildren = val;
            this.touchChildren = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sx.prototype, "mouseEnabled", {
        get: function () {
            return this._mouseEnabled;
        },
        set: function (val) {
            this._mouseEnabled = val;
            this.touchEnabled = val;
            this.touchThrough = !val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sx.prototype, "align", {
        get: function () {
            return this._align;
        },
        set: function (val) {
            if (val == 1) {
                this.PutCenter();
            }
            else if (val == 2) {
                this.PutRight();
            }
            this._align = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sx.prototype, "filters", {
        // public get filters(): Array<any> {//不能用这一句，然会滤镜会报错
        //     return this._filters;
        // }
        set: function (val) {
            this._filters = val;
            for (var i = 0, len = this.numChildren; i < len; i++) {
                this.getChildAt(i).filters = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    Sx.prototype.GetTemp = function (key) {
        if (this.sxInfo == null) {
            return 0;
        }
        return this.sxInfo[key];
    };
    Sx.prototype.SetTemp = function (key, val) {
        if (this.sxInfo == null) {
            this.sxInfo = new Listx();
        }
        this.sxInfo[key] = val;
    };
    Sx.prototype.RegisterGuide = function (guide, step) {
        if (step === void 0) { step = 0; }
        if (Sx.RegisterGuideFunc) {
            Sx.RegisterGuideFunc(this, guide, step);
        }
    };
    Sx.index = 0;
    Sx.autoHideOffset = 100;
    Sx._clickEvent = new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP);
    return Sx;
}(eui.Group));
__reflect(Sx.prototype, "Sx", ["Ix"]);
window["Sx"] = Sx;
///<reference path="Arr.ts" />
///<reference path="Dictionary.ts" />
var Observer = (function (_super) {
    __extends(Observer, _super);
    function Observer() {
        return _super.call(this) || this;
    }
    Observer.prototype.g = function (key) {
        return this.Get(key);
    };
    Observer.prototype.Get = function (name) {
        var val = null;
        if (!this.Exists(name)) {
            if (this._xml) {
                val = this._xml[name];
            }
        }
        else {
            val = _super.prototype.Get.call(this, name);
        }
        return val;
    };
    Observer.prototype.setProperty = function (name, value) {
        this.Set(name, value);
    };
    Observer.prototype.Dispose = function () {
        if (this._xml) {
            this._xml = null;
        }
        _super.prototype.Dispose.call(this);
    };
    return Observer;
}(Dictionary));
__reflect(Observer.prototype, "Observer");
window["Observer"] = Observer;
var NLabel = (function (_super) {
    __extends(NLabel, _super);
    function NLabel(val, color, bold, size, stroke, strokeColor, withBg) {
        if (val === void 0) { val = ""; }
        if (color === void 0) { color = -1; }
        if (bold === void 0) { bold = false; }
        if (size === void 0) { size = -1; }
        if (stroke === void 0) { stroke = 0; }
        if (strokeColor === void 0) { strokeColor = -1; }
        if (withBg === void 0) { withBg = false; }
        var _this = _super.call(this) || this;
        _this._color = 0;
        _this._bold = false;
        _this._size = 13;
        _this._italic = false;
        _this._stroke = 0;
        _this._strokeColor = 0;
        _this._key = "";
        _this._val = "";
        _this.htmlCustom = false;
        if (color < 0) {
            color = NLabel.defaultColor;
        }
        if (strokeColor < 0) {
            strokeColor = NLabel.defaultColor;
        }
        if (stroke > 20) {
            throw new Error("Error NLabel stroke");
        }
        var minSize = 0;
        if (Parms.phone) {
            minSize = NLabel.phoneFontSize;
        }
        else {
            minSize = NLabel.fontSize;
        }
        if (size < minSize) {
            size = minSize;
        }
        if (withBg) {
            _this.bg = new Sx();
            _this.Add(_this.bg);
        }
        _this.textF = new egret.TextField();
        _this.strokeColor = strokeColor;
        _this.stroke = stroke;
        _this.color = color;
        _this.bold = bold;
        _this.size = size;
        _this.textF.scaleX = 0.5;
        _this.textF.scaleY = 0.5;
        if (Strx.IsFull(NLabel.font)) {
            _this.textF.fontFamily = NLabel.font;
        }
        _this.Add(_this.textF);
        _this.val = val;
        _this.mouseChildren = false;
        return _this;
    }
    Object.defineProperty(NLabel.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (val) {
            this._color = val;
            this.textF.textColor = val;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(NLabel.prototype, "bold", {
        get: function () {
            return this._bold;
        },
        set: function (val) {
            this._bold = val;
            this.textF.bold = val;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(NLabel.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (val) {
            this._size = val;
            this.textF.size = val * 2;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(NLabel.prototype, "italic", {
        get: function () {
            return this._italic;
        },
        set: function (val) {
            this._italic = val;
            this.textF.italic = val;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(NLabel.prototype, "stroke", {
        get: function () {
            return this._stroke;
        },
        set: function (val) {
            this._stroke = val;
            if (val > 0) {
                this.textF.stroke = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(NLabel.prototype, "strokeColor", {
        get: function () {
            return this._strokeColor;
        },
        set: function (val) {
            this._strokeColor = val;
            if (val > 0) {
                this.textF.strokeColor = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(NLabel.prototype, "key", {
        get: function () {
            return this._key;
        },
        set: function (val) {
            this._key = val;
            if (val.length >= 3) {
                if (val.substr(0, 1) == "@") {
                    if (this.keyNum == null) {
                        this.keyNum = new Sx();
                        this.Add(this.keyNum);
                    }
                    this.keyNum.RemoveAll();
                    this.keyNum.Add(new NNum(val.substr(2, val.length - 2), val.substr(1, 1)));
                    this.textF.x = this.keyNum.width + 2;
                    return;
                }
            }
            if (this.keyTextField == null) {
                this.keyTextField = new NColorText(Lang.PT(this._key) + "：", this.bold, this.size, this.keyType);
                this.Add(this.keyTextField);
                this.keyTextField.size = this.size;
            }
            if (Lang.type == LangType.Chs || Lang.type == LangType.Cht) {
                this.keyTextField.val = Lang.PT(this._key) + "：";
            }
            else {
                this.keyTextField.val = Lang.PT(this._key) + ": ";
            }
            this.textF.x = this.keyTextField.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NLabel.prototype, "val", {
        get: function () {
            return this._val;
        },
        set: function (val) {
            if (this.disposed) {
                return;
            }
            //UnFlatten();
            if (val == null) {
                val = "";
            }
            this._val = val;
            var valText = val;
            // if (Number(this._val).toString() == this._val) {
            //     valText = Strx.GetSmaNum(Strx.Int(this._val));
            // }
            if (this.textF.multiline || valText.indexOf("</") > -1) {
                this.textF.textFlow = this.GetHtml(valText);
                this.HandleHtmlCustom();
            }
            else {
                this.textF.text = Lang.PT(valText);
            }
            // if (!this.textF.multiline) {
            //     this.textF.width = this.textF.textWidth + 5;
            //     //this.textF.width = this.textF.text.length * this.size + 15;
            //     // if (new Number(this.textF.text) > 0) {
            //     //     this.textF.width = this.textF.text.length * 15 + 15;
            //     // }
            //     // else {
            //     //     this.textF.width = this.textF.text.length * 30 + 30;
            //     //     //                    this.textF.width = this.textF.textWidth + 5;
            //     // }
            // }
            // this.textF.height = this.textF.textHeight + 5;
            if (this.textF.multiline) {
                //this.Add("empty", this.textF.width / 2, this.textF.height / 2);
                this.Add("gridlistempty", this.textF.width / 2, this.textF.height / 2);
            }
            if (this.align == 1) {
                this.PutCenter();
            }
            else if (this.align == 2) {
                this.PutRight();
            }
            //Flatten();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NLabel.prototype, "html", {
        set: function (val) {
            if (this.disposed) {
                return;
            }
            //UnFlatten();
            if (val == null) {
                val = "";
            }
            this._val = val;
            var valText = val;
            this.textF.textFlow = this.GetHtml(valText);
            this.HandleHtmlCustom();
            // if (new Number(this.textF.text) > 0) {
            //     this.textF.width = this.textF.text.length * 15 + 15;
            // }
            // else {
            //     this.textF.width = this.textF.text.length * 30 + 30;
            // }
            this.textF.width = this.textF.textWidth * 2 + 15;
            this.textF.height = this.textF.textHeight * 2 + 5;
            if (this.align == 1) {
                this.PutCenter();
            }
            else if (this.align == 2) {
                this.PutRight();
            }
        },
        enumerable: true,
        configurable: true
    });
    NLabel.prototype.GetHtml = function (html) {
        var _this = this;
        if (!NLabel.htmlTextParser) {
            NLabel.htmlTextParser = new egret.HtmlTextParser();
        }
        html = html.toString().replace(/<p>/g, "").replace(/<\/p>/g, "\n");
        var arr = NLabel.htmlTextParser.parser(Lang.PT(html));
        var index = 0;
        arr.forEach((function (fi) {
            if (fi.text.indexOf("[") > -1 && fi.text.indexOf("]") > -1) {
                var sb = [];
                var inAtt = false;
                var att_1 = { text: [], name: null, atts: [] };
                for (var i = 0, len = fi.text.length; i < len; i++) {
                    var c = fi.text.charAt(i);
                    if (c == "[") {
                        inAtt = true;
                    }
                    else if (c == "]") {
                        var text = att_1.text.join("");
                        text.split(" ").forEach(function (fi1) {
                            if (fi1.IsFull()) {
                                var fi1s = fi1.split("=");
                                var k = fi1s[0];
                                var v = "";
                                if (fi1s.length > 1) {
                                    v = fi1s[1];
                                }
                                if (v.IsFull()) {
                                    att_1.atts.push({ name: k, val: v });
                                }
                                else {
                                    att_1.name = k;
                                }
                            }
                        });
                        if (text.indexOf("/") > -1) {
                            //TODO:
                        }
                        inAtt = false;
                    }
                    else {
                        if (inAtt) {
                            att_1.text.push(c);
                        }
                        else {
                            sb.push(c);
                        }
                    }
                }
                if (att_1.name == "center/center") {
                    if (fi.style.size > 0) {
                        fi.text = NLabel.HtmlAlignCenter(sb.join(""), _this.textF.width, fi.style.size);
                    }
                    else {
                        fi.text = NLabel.HtmlAlignCenter(sb.join(""), _this.textF.width, _this.size);
                    }
                }
                else if (att_1.name == "hr" || att_1.name == "hr/hr") {
                    var node = { text: "\n" };
                    arr.splice(index, 0, node);
                    index++;
                    fi.text = "\u000B";
                    _this.htmlCustom = true;
                }
                else if (att_1.name == "bg" || att_1.name == "bg/bg") {
                    fi.style = { target: sb.join("") };
                    fi.text = "\u000C";
                    _this.htmlCustom = true;
                }
                else if (att_1.name == "underline" || att_1.name == "underline/underline") {
                    fi.style.underline = true;
                    fi.text = sb.join("");
                    _this.htmlCustom = true;
                }
                else {
                    fi.text = sb.join("");
                }
            }
            index++;
        }).bind(this));
        return arr;
    };
    NLabel.prototype.HandleHtmlCustom = function () {
        var _this = this;
        if (this.htmlCustom) {
            NForm.LazyCall(function () {
                if (_this.disposed) {
                    return;
                }
                var nodes = _this.textF.$renderNode.drawData;
                //Js.Trace(nodes);
                for (var i = 0, len = nodes.length - 4; i < len; i += 4) {
                    var x = nodes[i];
                    var y = nodes[i + 1];
                    var t = nodes[i + 2];
                    var d = nodes[i + 3];
                    if (t == "\n\u000B" || t == "\u000B") {
                        var line = new N9("line");
                        line.alpha = 0.8;
                        line.width = _this.width;
                        _this.Add(line, x, y / 2);
                        nodes[i + 3] = "";
                    }
                    else if (t == "\n\u000C" || t == "\u000C") {
                        var urls = d.target.split(":");
                        var bg = Assert.Img(urls[0]);
                        var bgx = 0;
                        var bgy = 0;
                        if (urls.length > 1) {
                            bgx = urls[1].ToInt();
                        }
                        if (urls.length > 2) {
                            bgy = urls[2].ToInt();
                        }
                        _this.bg.Add(bg, x + bgx, y / 2 - _this.size / 2 + bgy);
                        nodes[i + 3] = "";
                    }
                }
            });
        }
    };
    Object.defineProperty(NLabel.prototype, "valInt", {
        get: function () {
            return this.val.ToInt();
        },
        set: function (_val) {
            this.val = _val.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NLabel.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (val) {
            _super.prototype.SxSetX.call(this, val);
            if (this.align == 1) {
                this.PutCenter();
            }
            else if (this.align == 2) {
                this.PutRight();
            }
        },
        enumerable: true,
        configurable: true
    });
    NLabel.prototype.Bind = function (item, bindKey, act) {
        var _this = this;
        if (act === void 0) { act = null; }
        if (!item) {
            if (act) {
                this.val = act("");
            }
            else {
                this.val = "";
            }
            return;
        }
        if (this.bindEmptyP) {
            this.Remove(this.bindEmptyP);
        }
        this.bindEmptyP = new Sx();
        this.Add(this.bindEmptyP);
        this.item = item;
        this.act = act;
        this.bindKey = bindKey;
        item.ListenArray((function () {
            //Js.Trace("BLabel Changed");
            if (act == null) {
                _this.val = _this.item.g(_this.bindKey);
            }
            else {
                _this.val = _this.act(_this.item.g(_this.bindKey));
            }
        }).bind(this), bindKey.split(","), this.bindEmptyP);
    };
    NLabel.prototype.OnClick = function (act) {
        this.act = act;
        this.mouseEnabled = true;
        this.buttonMode = true;
        this.Click(function () {
            act();
        });
    };
    Object.defineProperty(NLabel.prototype, "width", {
        get: function () {
            if (this.disposed) {
                return 0;
            }
            else {
                return this.textF.textWidth / 2 + 5 + (this.keyTextField == null ? 0 : this.keyTextField.width);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NLabel.prototype, "height", {
        get: function () {
            if (this.disposed) {
                return 0;
            }
            else {
                if (this.val.IsEmpty()) {
                    return this.size;
                }
                else {
                    return this.textF.textHeight / 2;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    NLabel.prototype.SetMultiline = function (width, leading) {
        if (leading === void 0) { leading = 5; }
        if (this.textF.hasOwnProperty("leading")) {
            this.textF["leading"] = leading;
        }
        this.textF.multiline = true;
        //this.textF.wordWrap = true;
        this.textF.width = width * 2;
        this.textF.lineSpacing = leading * 2;
    };
    NLabel.prototype.Dispose = function () {
        _super.prototype.Dispose.call(this);
        this.act = null;
        this.keyTextField = null;
        this.textF = null;
        this.keyNum = null;
        this.bindEmptyP = null;
        this.item = null;
        this.faces = null;
    };
    NLabel.prototype.SetFaceVal = function (value) {
        //UnFlatten();
        if (this.faces == null) {
            this.faces = [];
        }
        this.faces.forEach(function (fi) {
            fi.RemoveMe();
        });
        this.faces.length = 0;
        var char = "　";
        value = value.replace(/　/g, " ");
        var faceArr = [];
        var face = value.match(/\{f\d{1,2}\}/g);
        if (face) {
            faceArr = faceArr.concat(face);
        }
        value = value.replace(/\{f\d{1,2}\}/g, "<font size='13'>" + char + "  </font>");
        this.val = value;
        var text = this.textF.text;
        var indexArr = [];
        for (var index = 0; index < text.length; index++) {
            if (text.charAt(index) == char) {
                indexArr.push(index);
            }
        }
        for (var i = 0; i < indexArr.length; i++) {
            //        var pos: Rectangle = textF.getCharBoundaries(indexArr[i]);
            //        var s: NSwfFast = new NSwfFast("Res/qqFace/" + faceArr[i].replace("{f","").replace("}","") + ".swf",null,false,true);
            //        Add(s,pos.x + 4,pos.y - 4);
            //        s.mouseEnabled = false;
            //        faces.push(s);
        }
    };
    NLabel.HtmlAlignCenter = function (text, w, fontSize) {
        text = text.replace(/<\/?.+?\/?>/g, "");
        return "".PaddingLeft(" ", (w - text.TrueLength() * fontSize / 2) / (fontSize / 2)) + text;
    };
    NLabel.font = "";
    NLabel.defaultColor = 0x502d17;
    NLabel.fontSize = 15;
    NLabel.phoneFontSize = 15;
    return NLabel;
}(Sx));
__reflect(NLabel.prototype, "NLabel");
window["NLabel"] = NLabel;
var Vector2 = (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.toString = function () {
        return this.x + "_" + this.y;
    };
    Vector2.prototype.Equals = function (p) {
        return this.x == p.x && this.y == p.y;
    };
    Vector2.prototype.Move = function (x, y) {
        return new Vector2(this.x + x, this.y + y);
    };
    Vector2.prototype.Multi = function (val) {
        return new Vector2(this.x * val, this.y * val);
    };
    Vector2.prototype.Distance = function (p) {
        var dx = (p.x - this.x);
        var dy = (p.y - this.y);
        return Math.sqrt(((dx * dx) + (dy * dy)));
    };
    Vector2.New = function (x, y) {
        return new Vector2(x, y);
    };
    return Vector2;
}());
__reflect(Vector2.prototype, "Vector2");
window["Vector2"] = Vector2;
var NScrollPanel = (function (_super) {
    __extends(NScrollPanel, _super);
    function NScrollPanel(w, h, updateInterval) {
        if (w === void 0) { w = 1; }
        if (h === void 0) { h = 1; }
        if (updateInterval === void 0) { updateInterval = 50; }
        var _this = _super.call(this) || this;
        _this.scrollerEndIndex = 0;
        _this._disableScroll = false;
        _this._disableMask = false;
        _this.view = new Sx();
        _this.w = w;
        _this.h = h;
        _this.updateInterval = updateInterval;
        _this.scroller = new eui.Scroller();
        _this.scroller.width = w;
        _this.scroller.height = h;
        _this.scroller.viewport = _this.view;
        _this.Add(_this.scroller);
        if (updateInterval > 0) {
            _this.scrollerEnd = _this.ScrollerEnd.bind(_this);
            _this.scroller.addEventListener(egret.Event.CHANGE, _this.scrollerEnd, _this);
            _this.Up(_this.scrollerEnd);
        }
        return _this;
        // this.bg = new NPanel(w, h, 15);
        // this.Add(new NSButton(this.bg));
    }
    NScrollPanel.prototype.ScrollerEnd = function (ev) {
        var _this = this;
        if (!this.disposed) {
            this.scrollerEndIndex++;
            var scrollerEndIndex1_1 = this.scrollerEndIndex;
            var obj_1 = { scrollH: this.scroller.viewport.scrollH, scrollV: this.scroller.viewport.scrollV };
            NForm.SetTimeout(this.updateInterval, (function () {
                if (!_this.disposed) {
                    if (_this.scrollerEndIndex == scrollerEndIndex1_1 || scrollerEndIndex1_1 % 12 == 0) {
                        if (_this.onScrollerEndList) {
                            _this.onScrollerEndList.forEach(function (fi) {
                                fi(obj_1);
                            });
                        }
                    }
                }
            }).bind(this));
        }
    };
    NScrollPanel.prototype.OnScrollerEnd = function (func) {
        if (!this.onScrollerEndList) {
            this.onScrollerEndList = [];
        }
        this.onScrollerEndList.push(func);
    };
    NScrollPanel.prototype.ScrollerTouchEnd = function (ev) {
    };
    NScrollPanel.prototype.Add = function (s1, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var s = null;
        if (typeof s1 == "string") {
            s = Assert.Img(s1);
        }
        else {
            s = s1;
        }
        var that = this;
        if (this.view == null || this.view == s || s instanceof eui.Scroller) {
            return _super.prototype.Add.call(this, s, x, y);
        }
        else {
            this.view.Add(s, x, y);
        }
        return true;
    };
    NScrollPanel.prototype.RemoveAll = function () {
        if (this.view == null) {
            return _super.prototype.RemoveAll.call(this);
        }
        else {
            for (var i = this.view.numChildren - 1; i >= 0; i--) {
                try {
                    var child = this.view.getChildAt(i);
                    if (child instanceof Sx) {
                        if (!(child).disposed) {
                            if ((child).base) {
                                continue;
                            }
                        }
                    }
                    this.view.removeChildAt(i);
                }
                catch (ex) { }
            }
        }
    };
    NScrollPanel.prototype.BaseAdd = function (s, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return _super.prototype.Add.call(this, s, x, y);
    };
    NScrollPanel.prototype.Resize = function (w, h) {
        this.scroller.width = w;
        this.scroller.height = h;
    };
    NScrollPanel.prototype.DisableScroll = function () {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this._disableScroll = true;
    };
    NScrollPanel.prototype.DisableScrollX = function () {
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    };
    NScrollPanel.prototype.DisableScrollY = function () {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
    };
    NScrollPanel.prototype.EnableScroll = function () {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.AUTO;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.AUTO;
    };
    NScrollPanel.prototype.EnableScrollX = function () {
        this.scroller.scrollPolicyH = eui.ScrollPolicy.AUTO;
    };
    NScrollPanel.prototype.EnableScrollY = function () {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.AUTO;
    };
    NScrollPanel.prototype.DisableMask = function () {
        this.DisableScroll();
        this.scroller.viewport.scrollEnabled = false;
        this._disableMask = true;
    };
    Object.defineProperty(NScrollPanel.prototype, "tween", {
        set: function (val) {
            if (val) {
                this.scroller.throwSpeed = 1;
            }
            else {
                this.scroller.throwSpeed = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NScrollPanel.prototype, "bounces", {
        set: function (val) {
            this.scroller.bounces = val;
        },
        enumerable: true,
        configurable: true
    });
    NScrollPanel.prototype.visibleInScrollV = function (p, cellHeight) {
        if (p.y >= this.scroller.viewport.scrollV && p.y <= this.scroller.viewport.scrollV + this.h
            || p.y + cellHeight >= this.scroller.viewport.scrollV && p.y + cellHeight <= this.scroller.viewport.scrollV + this.h) {
            return true;
        }
        return false;
    };
    NScrollPanel.prototype.visibleInScrollH = function (p, cellWidth) {
        if (p.x >= this.scroller.viewport.scrollH && p.x <= this.scroller.viewport.scrollH + this.w
            || p.x + cellWidth >= this.scroller.viewport.scrollH && p.x + cellWidth <= this.scroller.viewport.scrollH + this.w) {
            return true;
        }
        return false;
    };
    NScrollPanel.prototype.Dispose = function () {
        this.scroller.removeEventListener(egret.Event.CHANGE, this.scrollerEnd, this);
        if (this.onScrollerEndList) {
            this.onScrollerEndList.length = 0;
        }
        this.onScrollerEndList = null;
        if (this.view) {
            this.view.RemoveMe();
            this.view.Dispose();
        }
        _super.prototype.Dispose.call(this);
    };
    return NScrollPanel;
}(Sx));
__reflect(NScrollPanel.prototype, "NScrollPanel");
window["NScrollPanel"] = NScrollPanel;
var Bx = (function (_super) {
    __extends(Bx, _super);
    function Bx(val) {
        var _this = _super.call(this) || this;
        _this.this = _this;
        _this.base = false;
        _this.loaded = false;
        ////////////////////////////////
        _this.autoDispose = true;
        _this._x = 0;
        _this._y = 0;
        _this.disposed = false;
        _this._mouseChildren = true;
        _this._mouseEnabled = true;
        _this._align = 0;
        _this.depth = Number.MIN_VALUE;
        _this.addEventListenerBx(egret.Event.REMOVED, Bx.OnRemove);
        if (val) {
            _this.SetVal(val);
        }
        return _this;
    }
    Bx.prototype.SetVal = function (val) {
        if (val instanceof egret.Texture) {
            throw new Error("Do not use system Texture");
            //this.SetBitmap(val);
        }
        else if (val instanceof Textures) {
            this.SetBitmap(val);
        }
        else {
            if (val.length >= 4 && val.substr(0, 4) == "Res/") {
                this.SetBitmap(val);
            }
            else {
                //let texture = RES.getRes(val);
                var texture = Assert.assertList[val];
                if (texture) {
                    this.SetBitmap(Textures.GetTextures(texture));
                }
                else {
                    texture = RES.getRes(val);
                    if (texture) {
                        this.SetBitmap(Textures.GetTextures(texture));
                    }
                    else {
                        // if (Js.showTrace) {
                        //     throw new Error("Error Assert Img: " + val);
                        // }
                        if (Js.showTrace) {
                            Js.Trace("Error Assert Img: " + val);
                        }
                    }
                }
            }
        }
        this.name = val;
    };
    Bx.prototype.InfoChanged = function (key, oldValue, newValue, insert, obj) {
        var _this = this;
        if (parent == null) {
            if (!this.disposed) {
                NForm.SetTimeout(100, function () {
                    _this.InfoChanged(key, oldValue, newValue, insert, obj);
                });
            }
        }
        else {
            if (key == "depth") {
                var parent = this.parent;
                if (parent) {
                    parent.setChildIndex(this, parent.numChildren - 1);
                    for (var i = parent.numChildren - 1; i >= 0; i--) {
                        var child1 = parent.getChildAt(i);
                        if (child1 instanceof Sx || child1 instanceof Bx) {
                            var child = (child1);
                            if (!child["disposed"]) {
                                if (child.depth > newValue && child != this) {
                                    parent.setChildIndex(this, i);
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    Bx.OnRemove = function (ev) {
        //if(ev.currentTarget == ev.target)
        {
            if (ev.target instanceof Bx && ev.target.autoDispose) {
                ev.target.Dispose();
            }
        }
    };
    Bx.prototype.SetBitmap = function (val) {
        var _this = this;
        if (this.disposed) {
            return;
        }
        this.val = val;
        if (val instanceof egret.Texture) {
            throw new Error("Do not use system Texture");
            // this.texture = val;
            // this.loaded = true;
            // if (this.loadedFunc) {
            //     this.loadedFunc();
            // }
            // if (this.loadedFuncList) {
            //     this.loadedFuncList.Each((fi) => {
            //         fi();
            //     });
            // }
        }
        else if (val instanceof Textures) {
            val.UseTexture(this);
            this.loaded = true;
            if (this.loadedFunc) {
                this.loadedFunc();
            }
            if (this.loadedFuncList) {
                this.loadedFuncList.Each(function (fi) {
                    fi();
                });
            }
        }
        else {
            Src.Read(val, (function (textures) {
                if (textures) {
                    _this.SetBitmap(textures);
                }
                else {
                    _this.loaded = true;
                    if (_this.loadedFunc) {
                        _this.loadedFunc();
                    }
                    if (_this.loadedFuncList) {
                        _this.loadedFuncList.Each(function (fi) {
                            fi();
                        });
                    }
                }
            }).bind(this));
            //this.source = val;
        }
    };
    Object.defineProperty(Bx.prototype, "bitmapData", {
        set: function (val) {
            if (this.disposed) {
                return;
            }
            if (this.bitmapData == null) {
                this.source = val;
            }
            else {
                if (this.source != val) {
                    this.SetBitmap(val);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Bx.prototype.Dispose = function () {
        if (!this.disposed) {
            this.disposed = true;
            if (this.textures) {
                this.textures.UnUseTexture();
            }
            this.clearEventListener();
            this.listenerArr = null;
            if (this.OnDisposeList) {
                var OnDisposeList = this.OnDisposeList;
                this.OnDisposeList = null;
                OnDisposeList.Each(function (fi) {
                    try {
                        fi();
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                });
                this.OnDisposeList.Clear();
            }
            // if (this.OnLoadList) {
            //     this.OnLoadList.Clear();
            //     this.OnLoadList = null;
            // }
            if (this.onShowList) {
                this.onShowList.Clear();
                this.onShowList = null;
            }
            if (this.onHideList) {
                this.onHideList.Clear();
                this.onHideList = null;
            }
            if (this.onPosList) {
                this.onPosList.Clear();
                this.onPosList = null;
            }
            if (this.loadedFuncList) {
                this.loadedFuncList.Clear();
                this.loadedFuncList = null;
            }
            this.loadedFunc = null;
        }
    };
    Bx.prototype.addEventListenerBx = function (type, listener, u, p, w) {
        if (u === void 0) { u = false; }
        if (p === void 0) { p = 0; }
        if (w === void 0) { w = false; }
        this.addEventListener(type, listener, this);
        if (this.listenerArr == null) {
            this.listenerArr = new Arr();
        }
        var obj = { type: type, listener: listener };
        this.listenerArr.Add(obj);
        if (type != egret.Event.REMOVED) {
            this.mouseEnabled = true;
        }
    };
    Bx.prototype.removeEventListenerBx = function (type, listener, u) {
        if (u === void 0) { u = false; }
        this.removeEventListener(type, listener, this);
        if (this.listenerArr) {
            for (var i = 0, len = this.listenerArr.length; i < len; i++) {
                var fi = this.listenerArr[i];
                if (fi.type == type && fi.listener == listener) {
                    this.listenerArr.removeItemAt(i);
                    break;
                }
            }
        }
    };
    Bx.prototype.onlyRemoveEventListener = function (type, listener, u) {
        if (u === void 0) { u = false; }
        _super.prototype.removeEventListener.call(this, type, listener, this);
    };
    Bx.prototype.clearEventListener = function () {
        var _this = this;
        if (this.listenerArr && this.listenerArr.length > 0) {
            this.listenerArr.Each(function (fi) {
                _this.onlyRemoveEventListener(fi.type, fi.listener);
            });
            this.listenerArr.Clear();
        }
    };
    Bx.prototype.LocalX = function (globalX) {
        return this.globalToLocal(globalX, 0).x;
    };
    Bx.prototype.LocalY = function (globalY) {
        return this.globalToLocal(0, globalY).y;
    };
    Object.defineProperty(Bx.prototype, "globalX", {
        get: function () {
            return this.localToGlobal(0, 0).x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bx.prototype, "globalY", {
        get: function () {
            return this.localToGlobal(0, 0).y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bx.prototype, "scale", {
        set: function (val) {
            this.scaleX = 0.01 * val.x;
            this.scaleY = 0.01 * val.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bx.prototype, "display", {
        get: function () {
            return this.visible;
        },
        enumerable: true,
        configurable: true
    });
    Bx.prototype.Show = function () {
        if (this.followSx && !this.followSx.visible) {
            return;
        }
        this.visible = true;
    };
    Bx.prototype.Hide = function () {
        this.visible = false;
    };
    Object.defineProperty(Bx.prototype, "tops", {
        get: function () {
            if (this._top) {
                return this._top;
            }
            else if (this.parent && this.parent instanceof Sx) {
                return this.parent.tops;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bx.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (val) {
            var _this = this;
            this._x = val;
            _super.prototype.$setX.call(this, val);
            if (this.onPosList) {
                this.onPosList.Each(function (fi) {
                    fi(_this.x, _this.y);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bx.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (val) {
            var _this = this;
            this._y = val;
            _super.prototype.$setY.call(this, val);
            if (this.onPosList) {
                this.onPosList.Each(function (fi) {
                    fi(_this.x, _this.y);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bx.prototype, "position", {
        get: function () {
            return new Vector2(this._x, this._y);
        },
        set: function (val) {
            if (this.parent == null) {
                if (this.x != val.x) {
                    this.x = val.x;
                }
                if (this.y != val.y) {
                    this.y = val.y;
                }
            }
            else {
                if (this.x != val.x || this.y != val.y) {
                    //Form.LazyCall((() => {
                    this.x = val.x;
                    this.y = val.y;
                    //}).bind(this));
                    this._x = val.x;
                    this._y = val.y;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Bx.prototype.Pos = function (x, y) {
        this.position = new Vector2(x, y);
        return this;
    };
    Bx.prototype.Scale = function (x, y) {
        this.scale = new Vector2(x, y);
        return this;
    };
    Bx.prototype.PutCenter = function () {
        _super.prototype.$setX.call(this, this._x - this.width / 2);
    };
    Bx.prototype.PutRight = function () {
        _super.prototype.$setX.call(this, this._x - this.width);
    };
    Bx.prototype.OnPos = function (func) {
        if (this.onPosList == null) {
            this.onPosList = new Arr();
        }
        this.onPosList.Add(func);
    };
    Bx.prototype.OnPosSplice = function (func) {
        this.onPosList.Remove(func);
    };
    Bx.prototype.RemoveMe = function () {
        try {
            if (!this.disposed) {
                if (this.parent) {
                    this.parent.removeChild(this);
                }
                else {
                    if (this.autoDispose) {
                        this.Dispose();
                    }
                }
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
    };
    Object.defineProperty(Bx.prototype, "topVisible", {
        get: function () {
            if (!this.visible) {
                return false;
            }
            if (this.parent && this.parent instanceof Sx) {
                return this.parent.topVisible;
            }
            if (this.parent) {
                return this.parent.visible;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Bx.prototype.OnDispose = function (func) {
        if (this.OnDisposeList == null) {
            this.OnDisposeList = new Arr();
        }
        this.OnDisposeList.Add(func);
    };
    Bx.prototype.OnShow = function (func) {
        if (this.onShowList == null) {
            this.onShowList = new Arr();
        }
        this.onShowList.Add(func);
    };
    Bx.prototype.OnHide = function (func) {
        if (this.onHideList == null) {
            this.onHideList = new Arr();
        }
        this.onHideList.Add(func);
    };
    Bx.prototype.OnShowSplice = function (func) {
        this.onShowList.Remove(func);
    };
    Bx.prototype.OnHideSplice = function (func) {
        this.onHideList.Remove(func);
    };
    Object.defineProperty(Bx.prototype, "visible", {
        get: function () {
            return this.$visible;
        },
        set: function (val) {
            _super.prototype.$setVisible.call(this, val);
            if (val) {
                if (this.onShowList) {
                    this.onShowList.Each(function (fi) {
                        try {
                            fi();
                        }
                        catch (ex) {
                            Js.Trace(ex);
                        }
                    });
                }
            }
            else {
                if (this.onHideList) {
                    this.onHideList.Each(function (fi) {
                        try {
                            fi();
                        }
                        catch (ex) {
                            Js.Trace(ex);
                        }
                    });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Bx.prototype.To = function (stateTo, time, func, parseHandle) {
        if (time === void 0) { time = 1000; }
        if (func === void 0) { func = null; }
        if (parseHandle === void 0) { parseHandle = null; }
        return ActLite.To(this, stateTo, time, func, parseHandle);
    };
    Bx.prototype.ToPath = function (stateTo, func, parseHandle) {
        var _this = this;
        if (func === void 0) { func = null; }
        if (parseHandle === void 0) { parseHandle = null; }
        var index = 0;
        var nextFunc = function () {
            if (index >= stateTo.length) {
                nextFunc = null;
                if (func) {
                    func();
                }
            }
            else {
                var item = stateTo[index];
                index++;
                var time = item["time"];
                delete item["time"];
                _this.To(item, time, function () {
                    nextFunc();
                }, parseHandle);
            }
        };
        nextFunc();
    };
    // private OnLoadList: Arr<Function>;
    // public CallLoad(): void {
    //     if (!this.disposed) {
    //         if (this.OnLoadList) {
    //             this.OnLoadList.Each((fi)=>  {
    //                 try {
    //                     fi();
    //                 } catch (ex) {
    //                     Js.Trace(ex);
    //                 }
    //             });
    //         }
    //     }
    // }
    Bx.prototype.OnLoaded = function (func) {
        if (this.loaded) {
            func();
        }
        else {
            if (this.loadedFuncList == null) {
                this.loadedFuncList = new Arr();
            }
            this.loadedFuncList.Add(func);
        }
    };
    Bx.prototype.Follow = function (sx, offsetX, offsetY, delay, followDispose, followVisible) {
        var _this = this;
        if (offsetX === void 0) { offsetX = null; }
        if (offsetY === void 0) { offsetY = null; }
        if (delay === void 0) { delay = 0; }
        if (followDispose === void 0) { followDispose = true; }
        if (followVisible === void 0) { followVisible = true; }
        this.followSx = sx;
        if (offsetX == null) {
            offsetX = 0;
        }
        if (offsetY == null) {
            offsetY = 0;
        }
        sx.OnPos(function (x, y) {
            if (delay > 0) {
                NForm.SetTimeout(delay, function () {
                    if (offsetX instanceof Function) {
                        _this.x = offsetX(x);
                    }
                    else {
                        _this.x = x + offsetX;
                    }
                    if (offsetY instanceof Function) {
                        _this.y = offsetY(y);
                    }
                    else {
                        _this.y = y + offsetY;
                    }
                });
            }
            else {
                if (offsetX instanceof Function) {
                    _this.x = offsetX(x);
                }
                else {
                    _this.x = x + offsetX;
                }
                if (offsetY instanceof Function) {
                    _this.y = offsetY(y);
                }
                else {
                    _this.y = y + offsetY;
                }
            }
        });
        if (offsetX instanceof Function) {
            this.x = offsetX(sx.x);
        }
        else {
            this.x = sx.x + offsetX;
        }
        if (offsetY instanceof Function) {
            this.y = offsetY(sx.y);
        }
        else {
            this.y = sx.y + offsetY;
        }
        if (followDispose) {
            sx.OnDispose(function () {
                _this.Dispose();
            });
        }
        if (followVisible) {
            sx.OnShow(function () {
                _this.Show();
            });
            sx.OnHide(function () {
                _this.Hide();
            });
            if (sx.visible) {
                this.Show();
            }
            else {
                this.Hide();
            }
        }
    };
    Object.defineProperty(Bx.prototype, "mouseChildren", {
        get: function () {
            return this._mouseChildren;
        },
        set: function (val) {
            this._mouseChildren = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bx.prototype, "mouseEnabled", {
        get: function () {
            return this._mouseEnabled;
        },
        set: function (val) {
            this._mouseEnabled = val;
            this.touchEnabled = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bx.prototype, "align", {
        get: function () {
            return this._align;
        },
        set: function (val) {
            if (val == 1) {
                this.PutCenter();
            }
            else if (val == 2) {
                this.PutRight();
            }
            this._align = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bx.prototype, "textures", {
        get: function () {
            return this._textures;
        },
        set: function (textures) {
            this._textures = textures;
            this.texture = textures.GetTexture();
        },
        enumerable: true,
        configurable: true
    });
    return Bx;
}(eui.Image));
__reflect(Bx.prototype, "Bx", ["Ix"]);
window["Bx"] = Bx;
var LangType = (function () {
    function LangType() {
    }
    LangType.Chs = "chs";
    LangType.Cht = "cht";
    LangType.Jp = "jp";
    LangType.Test = "test";
    return LangType;
}());
__reflect(LangType.prototype, "LangType");
window["LangType"] = LangType;
var Arr = (function (_super) {
    __extends(Arr, _super);
    function Arr(source) {
        if (source === void 0) { source = null; }
        return _super.call(this, source) || this;
    }
    Object.defineProperty(Arr.prototype, "Count", {
        get: function () {
            return this.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arr.prototype, "Length", {
        get: function () {
            return this.length;
        },
        enumerable: true,
        configurable: true
    });
    Arr.prototype.Add = function (item) {
        this.addItem(item);
    };
    Arr.prototype.Remove = function (item) {
        var index = this.getItemIndex(item);
        if (index > -1) {
            this.removeItemAt(index);
        }
    };
    Arr.prototype.RemoveBy = function (func) {
        var len = this.length;
        for (var i = 0; i < len; i++) {
            if (func(this.getItemAt(i))) {
                this.RemoveAt(i);
                break;
            }
        }
    };
    Arr.prototype.RemoveAt = function (index) {
        this.removeItemAt(index);
    };
    Arr.prototype.InsertAt = function (item, index) {
        this.addItemAt(item, index);
    };
    Arr.prototype.Contian = function (item) {
        return this.getItemIndex(item) > -1;
    };
    Arr.prototype.Clear = function () {
        this.removeAll();
    };
    Arr.prototype.Each = function (func) {
        var len = this.length;
        //for (var i = len - 1; i >= 0; i--) {
        for (var i = 0; i < len; i++) {
            if (func(this.getItemAt(i), i)) {
                break;
            }
        }
        // this.source.forEach((fi) => {
        //     if (func(fi)) {
        //         return;
        //     }
        // });
    };
    Arr.prototype.EachDesc = function (func) {
        var len = this.length;
        for (var i = len - 1; i >= 0; i--) {
            if (func(this.getItemAt(i))) {
                break;
            }
        }
    };
    return Arr;
}(eui.ArrayCollection));
__reflect(Arr.prototype, "Arr");
window["Arr"] = Arr;
var NAniBase = (function (_super) {
    __extends(NAniBase, _super);
    function NAniBase(overAndRemove) {
        if (overAndRemove === void 0) { overAndRemove = true; }
        var _this = _super.call(this) || this;
        _this.img = null;
        _this.stopAtEnd = false;
        _this.load = false;
        _this._frameRate = 12;
        _this._stop = false;
        _this._stopAtEnd = false;
        _this._timerHandleIndex = 0;
        _this.addTime = 1;
        _this.stoped = false;
        _this.stopFrame = -1;
        _this.overAndRemove = overAndRemove;
        return _this;
    }
    NAniBase.prototype.Load = function (arr) {
        var _this = this;
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
                if (this.img != this) {
                    this.Add(this.img);
                }
            }
        }
        this.times = 0;
        this.frameCount = arr.Count;
        if (!this.load) {
            if (arr.Count > 1) {
                NForm.LazyCall(function () {
                    _this.TimerHandle();
                });
            }
            if (!this.disposed) {
                NForm.LazyCall(function () {
                    if (!_this.disposed) {
                        _this.CallLoad();
                    }
                });
            }
        }
        this.load = true;
    };
    Object.defineProperty(NAniBase.prototype, "frameRate", {
        get: function () {
            return this._frameRate;
        },
        set: function (val) {
            if (val <= 0) {
                val = 12;
            }
            if (this._frameRate != val) {
                this._frameRate = val;
                this.TimerHandle();
            }
        },
        enumerable: true,
        configurable: true
    });
    NAniBase.prototype.TimerHandle = function () {
        var _this = this;
        this._timerHandleIndex++;
        var _timerHandleIndex1 = this._timerHandleIndex;
        NForm.SetInterval(1000 / this.frameRate, function () {
            if (_this.disposed) {
                return true;
            }
            if (_timerHandleIndex1 != _this._timerHandleIndex) {
                return true;
            }
            if (!_this._stop) {
                _this.TimerHandler();
            }
            return false;
        });
    };
    NAniBase.prototype.LateFrame = function (per, lateCount) {
        if (per === void 0) { per = 75; }
        if (lateCount === void 0) { lateCount = 2; }
        //origLateFrameList = new Tuplex<int, int>(per, lateCount);
        //lateFrameList = new Tuplex<int, int>(per, lateCount);
    };
    NAniBase.prototype.ClearLateFrame = function () {
        this.lateFrameList = null;
    };
    NAniBase.prototype.Stop = function (frame) {
        if (frame === void 0) { frame = -1; }
        this.stoped = true;
        if (frame < 0) {
            frame = this.times;
        }
        this.times = frame;
        if (this.img && this.arr) {
            //this.img.SetData(this.arr[frame]);//由上进行处理
        }
    };
    NAniBase.prototype.Play = function (frame) {
        if (frame === void 0) { frame = -1; }
        this.stoped = false;
        if (frame >= 0) {
            this.times = frame;
        }
        this.stopFrame = -1;
    };
    NAniBase.prototype.PlayFrames = function (frames, stopFrame) {
        if (stopFrame === void 0) { stopFrame = -1; }
        this.stoped = false;
        if (frames.Count == 0) {
            frames = null;
        }
        this.frames = frames;
        this.stopFrame = stopFrame;
        if (frames) {
            this.times = 0;
        }
    };
    NAniBase.prototype.TimerHandler = function () {
        var _this = this;
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
                        NForm.LazyCall(function () {
                            _this.RemoveMe();
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
    };
    NAniBase.prototype.Dispose = function () {
        _super.prototype.Dispose.call(this);
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
    };
    return NAniBase;
}(Sx));
__reflect(NAniBase.prototype, "NAniBase");
window["NAniBase"] = NAniBase;
///<reference path="Strx.ts" />
///<reference path="Observer.ts" />
// if (!String.prototype.Arr) {
//     String.prototype.Arr = function () {
//         return Listx.GetArr(this);
//     };
// }
if (!String.prototype.ArrList) {
    String.prototype.ArrList = function () {
        return Listx.GetArrList(this);
    };
}
if (!String.prototype.Xqt) {
    String.prototype.Xqt = function () {
        return Listx.GetXmlLinqT(this);
    };
}
var Listx = (function (_super) {
    __extends(Listx, _super);
    function Listx() {
        var _this = _super.call(this) || this;
        _this._staticData = false;
        return _this;
    }
    Object.defineProperty(Listx, "listenCount", {
        get: function () {
            return Listx._listenCount;
        },
        set: function (val) {
            Listx._listenCount = val;
        },
        enumerable: true,
        configurable: true
    });
    Listx.TraceListen = function () {
        Listx.listenTraced = false;
        // Form.LazyCall(function () {
        //     if (!Listx.listenTraced) {
        //         Js.TraceDmx("Listen Count:" + Listx.listenCount);
        //         Listx.listenTraced = true;
        //     }
        // });
    };
    Listx.prototype.Listen = function (act, key, sx) {
        var that = this;
        if (this._staticData) {
            throw new Error("Static Data Can Not be Binded");
        }
        if (sx == null) {
            throw new Error("sx is null");
        }
        if (key && !this.Exists(key)) {
            this[key] = "";
        }
        Listx.listenCount++;
        Listx.TraceListen();
        var act1 = function () {
            that.changedFuncList.Remove(act2);
            act1 = null;
            act2 = null;
            Listx.listenCount--;
            Listx.TraceListen();
        };
        var act2 = function (_key, oldValue, newValue, obj) {
            if (act1 == null) {
                return;
            }
            // if (Js.showTrace) {
            //     if (act1 == null) {
            //         Js.Trace("Error: Disposed when listx listen action!");
            //     }
            // }
            if (key == null) {
                act(_key);
            }
            else if (key == _key) {
                act(oldValue, newValue);
            }
        };
        sx.OnDispose(act1);
        this.changedFuncList.Add(act2);
        if (key) {
            act();
        }
        this.CreateGS(key);
    };
    Listx.prototype.ListenArray = function (act, keys, sx) {
        var that = this;
        if (this._staticData) {
            throw new Error("Static Data Can Not be Binded");
        }
        Listx.listenCount++;
        Listx.TraceListen();
        var act1 = function () {
            that.changedFuncList.Remove(act2);
            act1 = null;
            act2 = null;
            Listx.listenCount--;
            Listx.TraceListen();
        };
        var act2 = function (_key, oldValue, newValue, obj) {
            for (var i = 0, len = keys.length; i < len; i++) {
                if (keys[i] == _key) {
                    act();
                    break;
                }
            }
        };
        sx.OnDispose(act1);
        this.changedFuncList.Add(act2);
        act();
        keys.forEach(function (fi) {
            this.CreateGS(fi);
        }.bind(this));
    };
    Listx.GetArrList = function (text) {
        if (Strx.IsEmpty(text)) {
            return new Array();
        }
        var arr = new Array();
        var items = text.split("*");
        for (var i = 0, len = items.length; i < len; i++) {
            arr.push(Listx.GetArr(items[i]));
        }
        return arr;
    };
    Listx.GetXmlLinqT = function (text) {
        var arr = Listx.GetArrList(text);
        var list = new XmlLinqT();
        for (var i = 0; i < arr.length; i++) {
            list.Add(arr[i]);
        }
        return list;
    };
    Listx.Arr = function (text) {
        return Listx.GetArr(text);
    };
    Listx.ArrSmart = function (text) {
        return Listx.GetArrSmart(text);
    };
    Listx.GetArr = function (text) {
        if (Strx.IsEmpty(text)) {
            return new Listx();
        }
        var list = new Listx();
        var items = text.split(",");
        var len = items.length;
        for (var i = 0; i < len; i++) {
            var items1 = items[i].split("|");
            if (items1.length >= 2) {
                var key = items1[0];
                try {
                    var value = items1[1];
                    value = value.replace(/#124;/g, "|").replace(/#42;/g, "*").replace(/#44;/g, ",").replace(/#35;/g, "#");
                    list.s(key, value);
                }
                catch (ex) {
                    Js.Trace(ex);
                }
            }
        }
        return list;
    };
    Listx.GetArrSmart = function (text) {
        if (Strx.IsEmpty(text)) {
            return new Listx();
        }
        var list = new Listx();
        var headLenList = "";
        var headInex = 0;
        for (var i = 0, len = text.length; i < len; i++) {
            var c = text[i];
            if (c == '_') {
                headInex = i;
                break;
            }
            headLenList += c;
        }
        var headLen = headLenList.ToInt();
        headInex++;
        var headText = text.substr(headInex, headLen);
        var lens = headText.split('_');
        var index = headInex + headLen;
        for (var i = 0, len = lens.length; i < len; i++) {
            var l = lens[i].ToInt();
            var k = text.substr(index, l);
            index += l;
            i++;
            l = lens[i].ToInt();
            var v = text.substr(index, l);
            list[k] = v;
            index += l;
        }
        return list;
    };
    Listx.prototype.Text = function () {
        var that = this;
        var text = [];
        this.EachKey(function (fi) {
            var val = that.Get(fi);
            if (val) {
                if (typeof val == "boolean") {
                    if (val) {
                        val = 1;
                    }
                    else {
                        val = 0;
                    }
                }
                var value = val.toString().split("#").join("#35;").split("|").join("#124;").split("*").join("#42;").split(",").join("#44;");
                text.push(fi + "|" + value);
            }
        });
        return text.join(",");
    };
    Listx.GetArrText = function (arr) {
        var text = [];
        arr.forEach(function (fi) {
            text.push(fi.Text());
        });
        return text.join("*");
    };
    Listx.prototype.CopyTo = function (list) {
        var _this = this;
        if (this.keys.length > 0) {
            this.keys.forEach(function (fi) {
                if (fi.IsFull()) {
                    if (fi.substr(0, 1) == "_") {
                        fi = fi.substr(1, fi.length - 1);
                    }
                    list[fi] = _this[fi];
                }
            });
        }
        else {
            this.EachKey(function (fi) {
                list[fi] = _this[fi];
            });
        }
    };
    Listx.prototype.GetPageSize = function (pageSize) {
        var rv = Math.ceil(this.Length / pageSize);
        if (rv <= 0) {
            rv = 1;
        }
        return rv;
    };
    // public GetPage(pageSize: number, page: number): Listx {
    //     var list: Listx = new Listx();
    //     //        for(var i: number = pageSize * page,len: number = pageSize * page + pageSize;i < len;i++) {
    //     //            var item: any = this.GetValue(i);
    //     //            if(item) {
    //     //                list[this.GetName(i)] = item;
    //     //            }
    //     //        }//TODO
    //     return list;
    // }
    Listx.prototype.Take = function (size, skip) {
        if (skip === void 0) { skip = 0; }
        var list = new Listx();
        var that = this;
        var index = 0;
        this.EachKey(function (fi) {
            if (index >= skip && index < skip + size) {
                list.Set(fi, that.Get(fi));
            }
            if (index >= skip + size) {
                return true;
            }
            index++;
            return false;
        });
        return list;
    };
    Listx.prototype.Where = function (func) {
        var that = this;
        var list = new Listx();
        this.EachKey(function (fi) {
            if (func(fi)) {
                list.Set(fi, that.Get(fi));
            }
        });
        return list;
    };
    Listx.prototype.Copy = function () {
        var list = new Listx();
        this.CopyTo(list);
        return list;
    };
    Listx.prototype.Count = function (func) {
        if (func === void 0) { func = null; }
        var rv = 0;
        this.Each(function (fi) {
            if (func(fi)) {
                rv++;
            }
        });
        return rv;
    };
    Listx.prototype.Any = function (func) {
        var rv = false;
        this.EachKey(function (fi) {
            if (func(fi)) {
                rv = true;
                return true;
            }
        });
        return rv;
    };
    Listx.prototype.All = function (func) {
        var rv = true;
        this.EachKey(function (fi) {
            if (!func(fi)) {
                rv = false;
                return true;
            }
        });
        return rv;
    };
    Listx.prototype.FirstOrDefault = function (func) {
        var rv = null;
        this.Each(function (fi) {
            if (func(fi)) {
                rv = fi;
                return true;
            }
        });
        return rv;
    };
    Listx.prototype.Max = function (func) {
        //var rv: number = Number.MIN_VALUE;
        var rv = -999999999;
        this.Each(function (fi) {
            rv = Math.max(rv, func(fi));
        });
        return rv;
    };
    Listx.prototype.Min = function (func) {
        var rv = Number.MAX_VALUE;
        this.Each(function (fi) {
            rv = Math.min(rv, func(fi));
        });
        return rv;
    };
    Listx.prototype.MaxItem = function (func) {
        if (this.Length == 0) {
            return null;
        }
        var maxVal = this.Max(func);
        return this.FirstOrDefault(function (item) {
            return func(item) == maxVal;
        });
    };
    Listx.prototype.toString = function () {
        return this.Text();
    };
    Listx.prototype.Dispose = function () {
        this.Clear();
        this._parent = null;
        _super.prototype.Dispose.call(this);
    };
    return Listx;
}(Observer));
__reflect(Listx.prototype, "Listx");
window["Listx"] = Listx;
///<reference path="NLabel.ts" />
var NColorText = (function (_super) {
    __extends(NColorText, _super);
    function NColorText(val, bold, size, style, showBorderFilters) {
        if (bold === void 0) { bold = false; }
        if (size === void 0) { size = -1; }
        if (style === void 0) { style = 10; }
        if (showBorderFilters === void 0) { showBorderFilters = true; }
        var _this = this;
        var color = -0;
        if (style == 0) {
            color = 0xffffff;
        }
        else {
            color = NColorText.arr[style];
        }
        // if (Js.SupportWebGL) {
        //     color = 0xffffff;
        // }
        if (val == null) {
            val = "";
        }
        val = val.replace(/<[^>]+>/g, "");
        _this = _super.call(this, val, color, bold, size, 2, 0x555555) || this;
        return _this;
        // if (Js.SupportWebGL) {
        //     if (style > 0) {
        //         if (showBorderFilters) {
        //             this.filters = NColorText.arrFilter[style];
        //         } else {
        //             this.filters = NColorText.arrFilterNoborder[style];
        //         }
        //     }
        // } else {
        //     if (style > 0) {
        //         this.filters = [new egret.GlowFilter(0x666666, 0.6, 4, 4, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
        //     }
        // }
    }
    NColorText.prototype.ValMulti = function (val, width, leading) {
        if (leading === void 0) { leading = 5; }
        this.SetMultiline(width, leading);
        this.val = val;
    };
    NColorText.ExsistStyle = function (style) {
        return true;
    };
    Object.defineProperty(NColorText.prototype, "style", {
        set: function (val) {
            if (Js.SupportWebGL) {
                if (val > 0) {
                    //if (this.showBorderFilters) {
                    this.filters = NColorText.arrFilter[val];
                    //} else {
                    //    this.filters = NColorText.arrFilterNoborder[val];
                    //}
                }
            }
            else {
                this.color = NColorText.arr[val];
            }
        },
        enumerable: true,
        configurable: true
    });
    NColorText.willEmbedFontsFunc = null;
    NColorText.starlingOffsetSize = 5;
    return NColorText;
}(NLabel));
__reflect(NColorText.prototype, "NColorText");
window["NColorText"] = NColorText;
var Music = (function () {
    function Music(id, loopTimes) {
        if (loopTimes === void 0) { loopTimes = 1; }
        this.disposed = false;
        this.loopTimes = loopTimes;
        try {
            this.Load(id);
        }
        catch (ex) {
            Js.Trace(ex);
        }
    }
    Music.prototype.Load = function (id) {
        this.id = id;
        try {
            var path = Config.icoPath + "music/" + id + ".mp3";
            this.sound = new egret.Sound();
            this.sound.once(egret.Event.COMPLETE, this.LoadComplete, this);
            this.sound.once(egret.IOErrorEvent.IO_ERROR, this.LoadError, this);
            this.sound.load(path);
        }
        catch (ex) {
            Js.Trace(ex);
        }
    };
    Music.prototype.LoadComplete = function () {
        this.loaded = true;
        if (!this.stoped) {
            this.Play();
        }
    };
    Music.prototype.Play = function () {
        this.stoped = false;
        if (this.loaded) {
            this.channel = this.sound.play(0, this.loopTimes);
            this.channel.once(egret.Event.SOUND_COMPLETE, this.PlayEnd, this);
        }
    };
    Music.prototype.Stop = function () {
        this.stoped = true;
        if (this.channel) {
            this.channel.stop();
        }
    };
    Music.prototype.LoadError = function () {
        Js.Trace("Sound Error: " + this.id);
    };
    Music.prototype.PlayEnd = function () {
        //this.Dispose();
    };
    Music.Play = function (id) {
        try {
            if (!Music.musicOn) {
                return;
            }
            if (Music.mList.Exists(id)) {
                Music.mList[id].Play();
            }
            else {
                var m = new Music(id);
                Music.mList[id] = m;
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
    };
    Music.Load = function (id) {
        try {
            if (!Music.musicOn) {
                return;
            }
            if (!Music.mList.Exists(id)) {
                var m = new Music(id);
                Music.mList[id] = m;
                m.stoped = true;
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
    };
    Music.Bg = function (id) {
        try {
            Js.Trace("setBgMusic: " + id);
            if (Music.bgId == id) {
                return;
            }
            Music.preBgId = Music.bgId;
            Music.bgId = id;
            if (Music._bg) {
                Music._bg.Stop();
            }
            if (!Music.musicBgOn) {
                return;
            }
            if (id.IsFull()) {
                if (Music.mList.Exists(id)) {
                    Music.mList[id].Play();
                }
                else {
                    var m = new Music(id, -1);
                    Music.mList[id] = m;
                    Music._bg = m;
                }
                Music._bg = Music.mList[id];
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
        return Music._bg;
    };
    Music.BgStop = function () {
        if (Music._bg) {
            Music._bg.Stop();
        }
    };
    Object.defineProperty(Music, "musicBgOn", {
        get: function () {
            Music._musicBgOn = Server.GetIO("musicBgOff").IsFull() ? false : true;
            return Music._musicBgOn;
        },
        set: function (val) {
            if (Music._musicBgOn != val) {
                Music._musicBgOn = val;
                if (val) {
                    Server.SetIO("musicBgOff", "");
                }
                else {
                    Server.SetIO("musicBgOff", "1");
                }
                if (val) {
                    var bgId = Music.bgId;
                    Music.bgId = "";
                    Music.Bg(bgId);
                }
                else {
                    Music.BgStop();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(Music, "musicOn", {
        get: function () {
            Music._musicOn = Server.GetIO("musicOff").IsFull() ? false : true;
            return Music._musicOn;
        },
        set: function (val) {
            if (Music._musicOn != val) {
                Music._musicOn = val;
                if (val) {
                    Server.SetIO("musicOff", "");
                }
                else {
                    Server.SetIO("musicOff", "1");
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Music.prototype.Dispose = function () {
        var that = this;
        if (!this.disposed) {
            this.disposed = true;
            if (this.channel) {
                this.channel.stop();
                this.channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.PlayEnd, this);
                this.channel = null;
            }
            if (this.sound) {
                this.sound.removeEventListener(egret.Event.COMPLETE, this.LoadComplete, this);
                this.sound.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.LoadError, this);
                this.sound.close();
                this.sound = null;
            }
        }
    };
    Music.mList = new Listx();
    return Music;
}());
__reflect(Music.prototype, "Music");
window["Music"] = Music;
///<reference path="../Dmx/Arr.ts" />
var NForm = (function () {
    function NForm() {
    }
    NForm.Load = function (stage) {
        NForm.stage = stage;
        NForm.Down(function () {
            NForm.downDt = new Date();
        }, NForm.main);
    };
    NForm.HideMain = function () {
        NForm.main.Hide();
    };
    NForm.ShowMain = function () {
        NForm.main.Show();
    };
    Object.defineProperty(NForm, "width", {
        get: function () {
            return NForm.stage.stageWidth + NForm.stageWidthOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NForm, "height", {
        get: function () {
            return NForm.stage.stageHeight + NForm.stageHeightOffset;
        },
        enumerable: true,
        configurable: true
    });
    NForm.TopLeft = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        dis.Pos(x, y);
    };
    NForm.TopLeftExtra = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        NForm.TopLeft(dis, x, y);
    };
    NForm.Top = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 + x, y);
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.TopExtra = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 - dis.width / 2 + x, y);
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.TopRight = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.Pos(NForm.width + x, y);
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.TopRightExtra = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        NForm.TopRight(dis, -dis.width + x, y);
    };
    NForm.Left = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.Pos(x, NForm.height / 2 + y);
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.LeftExtra = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        NForm.Left(dis, x, -dis.height / 2 + y);
    };
    NForm.Center = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 + x, NForm.height / 2 + y);
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.CenterExtra = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 - dis.width / 2 + x, NForm.height / 2 - dis.height / 2 + y);
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.Right = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.Pos(NForm.width + x, NForm.height / 2 + y);
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.RightExtra = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        NForm.Right(dis, -dis.width + x, -dis.height / 2 + y);
    };
    NForm.BottomLeft = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.Pos(x, NForm.height + y);
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.BottomLeftExtra = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        NForm.BottomLeft(dis, x, -dis.height + y);
    };
    NForm.Bottom = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 + x, NForm.height + y);
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.BottomExtra = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.Pos(NForm.width / 2 - dis.width / 2 + x, NForm.height - dis.height + y);
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.BottomRight = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.Pos(NForm.width + x, NForm.height + y);
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.BottomRightExtra = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        NForm.BottomRight(dis, -dis.width + x, -dis.height + y);
    };
    NForm.Full = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            dis.width = NForm.width + x;
            dis.height = NForm.height + y;
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.FullAndStageZero = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            dis.width = NForm.width + x;
            dis.height = NForm.height + y;
            NForm.LazyCall(function () {
                NForm.LazyCall(function () {
                    NForm.LazyCall(function () {
                        if (dis.parent != NForm.stage) {
                            dis.x = -dis.parent.globalX;
                            dis.y = -dis.parent.globalY;
                        }
                        else {
                            dis.x = 0;
                            dis.y = 0;
                        }
                    });
                });
            });
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.FullExtra = function (dis, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            dis.width = NForm.width + x;
            dis.height = NForm.height + y;
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.FullWidth = function (dis, x) {
        if (x === void 0) { x = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.width = NForm.width + x;
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.FullHeight = function (dis, y) {
        if (y === void 0) { y = 0; }
        if (dis.disposed) {
            return;
        }
        var act = function (ev) {
            if (!dis.disposed) {
                dis.height = NForm.height + y;
            }
            else {
                NForm.stage.removeEventListener(egret.Event.RESIZE, act, NForm.stage);
            }
        };
        act(null);
        NForm.stage.addEventListener(egret.Event.RESIZE, act, NForm.stage);
    };
    NForm.Click = function (func, sx) {
        NForm.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, func, NForm.stage);
        sx.OnDispose(function () {
            NForm.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, NForm.stage);
        });
    };
    NForm.Down = function (func, sx) {
        NForm.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, func, NForm.stage);
        sx.OnDispose(function () {
            NForm.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, func, NForm.stage);
        });
    };
    NForm.Up = function (func, sx) {
        NForm.stage.addEventListener(egret.TouchEvent.TOUCH_END, func, NForm.stage);
        sx.OnDispose(function () {
            NForm.stage.removeEventListener(egret.TouchEvent.TOUCH_END, func, NForm.stage);
        });
    };
    NForm.Move = function (func, sx) {
        NForm.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, func, NForm.stage);
        sx.OnDispose(function () {
            NForm.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, func, NForm.stage);
        });
    };
    NForm.Resize = function (func, sx) {
        NForm.stage.addEventListener(egret.Event.RESIZE, func, NForm.stage);
        sx.OnDispose(function () {
            NForm.stage.removeEventListener(egret.Event.RESIZE, func, NForm.stage);
        });
    };
    Object.defineProperty(NForm, "mouseX", {
        get: function () {
            if (!NForm._mouseXYEvent) {
                NForm._mouseXYEvent = true;
                NForm.Move(function (ev) {
                    NForm._mouseX = ev.stageX;
                    NForm._mouseY = ev.stageY;
                }, NForm.main);
            }
            if (NForm._mouseX < 0) {
                return NForm.width / 2;
            }
            else {
                return NForm._mouseX;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NForm, "mouseY", {
        get: function () {
            if (!NForm._mouseXYEvent) {
                NForm._mouseXYEvent = true;
                NForm.Move(function (ev) {
                    NForm._mouseX = ev.stageX;
                    NForm._mouseY = ev.stageY;
                }, NForm.main);
            }
            if (NForm._mouseY < 0) {
                return NForm.height / 2;
            }
            else {
                return NForm._mouseY;
            }
        },
        enumerable: true,
        configurable: true
    });
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
    NForm.EnterFrame = function (ev) {
        try {
            if (NForm.toList != null && NForm.toList.Length > 0) {
                NForm.toList.Each(function (fi) {
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
                                Js.Trace(ex);
                            }
                        }
                        fi = null;
                    }
                    else {
                        fi[2]--;
                    }
                });
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
        try {
            if (NForm.toTargetList != null && NForm.toTargetList.Length > 0) {
                NForm.toTargetList.Each(function (fi) {
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
                                Js.Trace(ex);
                            }
                        }
                        fi = null;
                    }
                    else {
                        fi[2]--;
                    }
                });
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
        try {
            if (NForm.valuesToList != null && NForm.valuesToList.Count > 0) {
                NForm.valuesToList.Each(function (fi) {
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
                        Js.Trace(ex);
                        NForm.valuesToList.Remove(fi);
                        fi = null;
                    }
                });
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
        try {
            if (NForm.setTimeoutList != null && NForm.setTimeoutList.Count > 0) {
                var now = Server.Now;
                NForm.setTimeoutList.Each(function (fi) {
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
                        Js.Trace(ex);
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
                NForm.setIntervalList.Each(function (fi) {
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
    };
    NForm.To = function (ix, vec, times, act) {
        if (times === void 0) { times = 20; }
        if (act === void 0) { act = null; }
        //times = times * fixedFrameRate / 60;//TODO:
        if (ix == null || ix.disposed) {
            return;
        }
        if (NForm.toList == null) {
            NForm.toList = new Arr();
        }
        if (NForm.toTargetList == null) {
            NForm.toTargetList = new Arr();
        }
        NForm.toList.RemoveBy(function (fi) {
            return fi[5] == ix;
        });
        NForm.toTargetList.RemoveBy(function (fi) {
            return fi[6] == ix;
        });
        var item = [new Vector2(0.01 * ((vec.x - ix.x) * 100 / times), 0.01 * ((vec.y - ix.y) * 100 / times)), vec, times, act, ix];
        NForm.toList.Add(item);
    };
    NForm.ToTarget = function (ix, target, offset, times, act) {
        if (times === void 0) { times = 20; }
        if (act === void 0) { act = null; }
        //times = times * fixedFrameRate / 60;//TODO:
        if (ix == null || ix.disposed) {
            return;
        }
        if (NForm.toList == null) {
            NForm.toList = new Arr();
        }
        if (NForm.toTargetList == null) {
            NForm.toTargetList = new Arr();
        }
        NForm.toList.RemoveBy(function (fi) {
            return fi[5] == ix;
        });
        NForm.toTargetList.RemoveBy(function (fi) {
            return fi[6] == ix;
        });
        var item = [new Vector2(ix.x, ix.y), target, times, times, offset, act, ix];
        NForm.toTargetList.Add(item);
    };
    NForm.ValuesTo = function (begin, to, times, act, end) {
        if (end === void 0) { end = null; }
        //times = times * fixedFrameRate / 60;//TODO:
        if (NForm.valuesToList == null) {
            NForm.valuesToList = new Arr();
        }
        var item = [(to - begin) / times, to, times, act, end];
        NForm.valuesToList.Add(item);
    };
    NForm.SetTimeout = function (time, act) {
        if (NForm.setTimeoutList == null) {
            NForm.setTimeoutList = new Arr();
        }
        var item = [Server.Now.AddMilliseconds(time), act];
        NForm.setTimeoutList.Add(item);
        //setTimeout(act, Math.max(time, 1));//TODO:小程序可能不支持，这里要改进，不然会卡？
    };
    NForm.SetInterval = function (time, act) {
        if (NForm.setIntervalList == null) {
            NForm.setIntervalList = new Arr();
        }
        var item = [Server.Now.AddMilliseconds(time), time, act];
        NForm.setIntervalList.Add(item);
        // let num = 0;
        // let a: Function = () => {
        //     if (act()) {
        //         clearInterval(num);
        //     }
        // };
        // num = setInterval(a, time);//TODO:小程序可能不支持
    };
    NForm.MainThread = function (act) {
        NForm.SetTimeout(1, act);
    };
    NForm.LazyCall = function (act) {
        NForm.SetTimeout(1, act);
    };
    NForm.AddHandleAutoHide = function (sx) {
        NForm.autoHideList.Add(sx);
    };
    NForm.HandleAutoHide = function () {
        var count = 0;
        NForm.autoHideList.Each(function (sx) {
            if (sx.disposed) {
                NForm.autoHideList.Remove(sx);
                sx = null;
            }
            else {
                if (sx.showTop50 && count >= 50) {
                    sx.HandleAutoHide_Hide();
                }
                else {
                    var rv = sx.HandleAutoHide();
                    if (rv) {
                        if (sx.showTop50) {
                            count++;
                        }
                    }
                }
            }
        });
    };
    NForm.NARROW = false; //竖屏情况下，iphoneX会发生这种情况
    NForm.WIDE = false; //竖屏情况下，会发生这种情况
    NForm.moved = false;
    NForm.styleSetupLoad = false;
    NForm.stageScale = 1;
    NForm.stageWidthOffset = 0;
    NForm.stageHeightOffset = 0;
    NForm.stageX = 0;
    NForm.stageY = 0;
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
    NForm._mouseXYEvent = false;
    NForm._mouseX = -1;
    NForm._mouseY = -1;
    //////////////////////////////////////
    NForm.autoHideList = new Arr();
    return NForm;
}());
__reflect(NForm.prototype, "NForm");
window["NForm"] = NForm;
var Filters = (function () {
    function Filters() {
    }
    Object.defineProperty(Filters, "borderFilter", {
        get: function () {
            return [new egret.GlowFilter(0x000000, 0.6, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "deepBorderFilter", {
        get: function () {
            return [new egret.GlowFilter(0x4d2600, 1, 4, 4, 4, 1), new egret.DropShadowFilter(2, 45, 0x4d2600, 1, 1, 1, 13, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "tabBorderFilter", {
        get: function () {
            return [new egret.GlowFilter(0x642e0a, 1, 5, 5, 6, 1)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "tabBorderFilterOff", {
        get: function () {
            return [new egret.GlowFilter(0xffffff, 1, 5, 5, 6, 1)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "borderFilter0", {
        get: function () {
            return [new egret.GlowFilter(0x965805, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "borderFilter1", {
        get: function () {
            return [new egret.GlowFilter(0x00295f, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "borderFilter2", {
        get: function () {
            return [new egret.GlowFilter(0x8c2e24, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "borderFilter3", {
        get: function () {
            return [new egret.GlowFilter(0x7c5131, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "borderFilter4", {
        get: function () {
            return [new egret.GlowFilter(0x006e27, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "borderFilter5", {
        get: function () {
            return [new egret.GlowFilter(0x8c613f, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "greenBorderFilter", {
        get: function () {
            return [new egret.GlowFilter(0x003300, 0.6, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "borderLightFilter", {
        get: function () {
            return [new egret.GlowFilter(0x000000, 0.2, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "lightGlowFilter", {
        get: function () {
            return [new egret.GlowFilter(0xffffbe, 0.55, 4, 4, 5, 1)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "glowFilter", {
        get: function () {
            return [new egret.GlowFilter(0x140c09, 0.35, 8, 8, 3, 1)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "blackLineFilter", {
        get: function () {
            return [new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.9, 3, 2, 20, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "blackLightLineFilter", {
        get: function () {
            return [new egret.DropShadowFilter(1, 45, 0x000000, 0.9, 1, 1, 3, 2)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "knockoutGlowFilter", {
        get: function () {
            return [new egret.GlowFilter(0x88ff88, 0.75, 6, 6, 3, 1, true, true), new egret.BlurFilter(3, 3, 1)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "knockoutWhiteGlowFilter", {
        get: function () {
            return [new egret.GlowFilter(0xffffff, 0.8, 6, 6, 10, 1, true, true), new egret.BlurFilter(3, 3, 1)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "knockoutRedGlowFilter", {
        get: function () {
            return [new egret.GlowFilter(0xff0000, 0.75, 20, 20, 5, 1, true, true), new egret.BlurFilter(3, 3, 1)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "knockoutGrayFilter", {
        get: function () {
            return [new egret.GlowFilter(0x888888, 0.75, 20, 20, 2, 1, true, true)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "blackFilter", {
        get: function () {
            return [new egret.GlowFilter(0x000000, 1, 2, 2, 5, 1)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "redFilter", {
        get: function () {
            return [new egret.ColorMatrixFilter([
                    0.3086, 0.6094, 0.0820, 0, 0,
                    0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0,
                    0, 0, 0, 1, 0
                ])];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "grayFilter", {
        get: function () {
            // return [new egret.ColorMatrixFilter([
            //     0.3086, 0.6094, 0.0820, 0, 0,
            //     0.3086, 0.6094, 0.0820, 0, 0,
            //     0.3086, 0.6094, 0.0820, 0, 0,
            //     0, 0, 0, 1, 0
            // ])];
            return [new egret.ColorMatrixFilter([
                    0.3, 0.6, 0, 0, 0,
                    0.3, 0.6, 0, 0, 0,
                    0.3, 0.6, 0, 0, 0,
                    0, 0, 0, 1, 0
                ])];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "lightGrayFilter", {
        get: function () {
            return [new egret.ColorMatrixFilter([
                    0.4, 0.7, 0.1, 0, 0,
                    0.4, 0.7, 0.1, 0, 0,
                    0.4, 0.7, 0.1, 0, 0,
                    0, 0, 0, 1, 0
                ])];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "brownGlowFilter", {
        get: function () {
            return [new egret.GlowFilter(0x660000, 0.7, 10, 10, 3, 1)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "greenGlowFilter", {
        get: function () {
            return [new egret.GlowFilter(0x00ff00, 0.55, 4, 4, 2, 1)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "redGlowFilter", {
        get: function () {
            return [new egret.GlowFilter(0xff0000, 0.55, 4, 4, 2, 1)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filters, "highLightFilter", {
        get: function () {
            return [new egret.ColorMatrixFilter([
                    1.5, 0, 0, 0, 0,
                    0, 1.5, 0, 0, 0,
                    0, 0, 1.5, 0, 0,
                    0, 0, 0, 1, 0
                ])];
        },
        enumerable: true,
        configurable: true
    });
    return Filters;
}());
__reflect(Filters.prototype, "Filters");
window["Filters"] = Filters;
var IOx = (function () {
    function IOx() {
    }
    IOx.ReadURL = function (path, urlLoaded, urlError, data, method) {
        if (urlError === void 0) { urlError = null; }
        if (data === void 0) { data = ""; }
        if (method === void 0) { method = egret.HttpMethod.POST; }
        var req = new egret.HttpRequest();
        req.responseType = egret.HttpResponseType.TEXT;
        req.open(path, method);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send(data);
        if (data.length > 50) {
            Js.Trace(path + "?");
        }
        else {
            Js.Trace(path + "?" + data);
        }
        req.once(egret.Event.COMPLETE, function (ev) {
            switch (ev.type) {
                case egret.Event.COMPLETE:
                    var text = ev.currentTarget.response;
                    Js.Trace(text);
                    urlLoaded(text);
                    break;
                case egret.IOErrorEvent.IO_ERROR:
                    Js.Trace("null");
                    urlLoaded(null);
                    break;
            }
        }, null);
        req.once(egret.IOErrorEvent.IO_ERROR, function (ev) {
            urlLoaded(null);
            if (urlError) {
                urlError(ev);
            }
        }, null);
    };
    IOx.ReadURLContent = function (path, urlLoaded, urlError, data) {
        if (urlError === void 0) { urlError = null; }
        if (data === void 0) { data = ""; }
        var req = new egret.HttpRequest();
        req.responseType = egret.HttpResponseType.ARRAY_BUFFER;
        req.open(path, egret.HttpMethod.POST);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send(data);
        req.once(egret.Event.COMPLETE, function (ev) {
            urlLoaded(req.response);
        }, null);
        if (urlError) {
            req.once(egret.IOErrorEvent.IO_ERROR, urlError, null);
        }
    };
    return IOx;
}());
__reflect(IOx.prototype, "IOx");
window["IOx"] = IOx;
///<reference path="Dictionary.ts" />
var Js = (function (_super) {
    __extends(Js, _super);
    function Js() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Js.Call = function (str) {
        try {
            return eval(str);
        }
        catch (ex) { }
        return null;
    };
    Js.FullScreen = function () {
        Js.Call("window.RequestFullScreen();");
    };
    Js.Trace = function (str) {
        if (Js.TraceCmd) {
            Js.TraceCmd(str);
        }
        if (Js.showTrace) {
            if (typeof (str) == "string" && str.indexOf("rror") > 0)
                console.log('%c ' + str + ' ', 'color: #e40e0e');
            console.log(str);
            //str = "!function(){" + "var div = document.createElement('div');" + "div.style.color = '#ff0000';" + "div.innerHTML = '" + str.toString().replace(/'/g, "\'").replace(/</g, "&lt;") + "';" + "document.body.appendChild(div);" + "}();";
            //Js.Call(str);
        }
    };
    Js.TraceObj = function (obj) {
        for (var fi in obj) {
            Js.Trace(fi + ":" + obj[fi]);
        }
    };
    Js.TraceDmx = function (str) {
        if (Js.showTrace) {
            if (Js.TraceCmdDmx) {
                Js.TraceCmdDmx(str);
            }
        }
    };
    Js.GetParm = function (url, method) {
        try {
            var urls = url.split("?");
            if (urls.length > 1) {
                var parm = urls[1];
                var parms = parm.split("&");
                for (var i = 0, len = parms.length; i < len; i++) {
                    if (parms[i].split("=")[0] == method) {
                        return parms[i].split("=")[1];
                    }
                }
            }
        }
        catch (ex) { }
        return "";
    };
    Js.GetUrlParm = function (method) {
        try {
            var parm = Js.Call("GetParm('" + method + "')");
            if (Strx.IsFull(parm)) {
                return parm;
            }
        }
        catch (ex) { }
        try {
            var url = window.location.toString();
            return Js.GetParm(url, method);
        }
        catch (ex) { }
        return "";
    };
    Js.OpenWindow = function (url, target, features) {
        if (target === void 0) { target = "_blank"; }
        if (features === void 0) { features = ""; }
        try {
            var browserName = Js.GetBrowserName();
            Js.Trace(browserName);
            window.open(url, target, features);
        }
        catch (ex) { }
    };
    Js.GetBrowserName = function () {
        var browser;
        try {
            var browserAgent = navigator.userAgent;
            Js.Trace(browserAgent);
            if (browserAgent && browserAgent.indexOf("Firefox") >= 0) {
                browser = "Firefox";
            }
            else if (browserAgent && browserAgent.indexOf("Chrome") >= 0) {
                browser = "Chrome";
            }
            else if (browserAgent && browserAgent.indexOf("Safari") >= 0) {
                browser = "Safari";
            }
            else if (browserAgent && browserAgent.indexOf("MSIE") >= 0) {
                browser = "IE";
            }
            else if (browserAgent && browserAgent.indexOf("Opera") >= 0) {
                browser = "Opera";
            }
            else {
                browser = "Undefined";
            }
        }
        catch (ex) { }
        return browser;
    };
    Object.defineProperty(Js, "SupportWebGL", {
        get: function () {
            if (Js._supportWebGL <= 0) {
                try {
                    var c = document.getElementById("supportWebGLCanvas");
                    if (!c) {
                        c = document.createElement("canvas");
                        c.style.display = " none";
                        c.id = "supportWebGLCanvas";
                    }
                    var g = c.getContext("webgl");
                    if (g) {
                        Js._supportWebGL = 1;
                        return true;
                    }
                    else {
                        Js._supportWebGL = 2;
                        return false;
                    }
                }
                catch (ex) {
                    Js.Trace(ex);
                }
                Js._supportWebGL = 1;
                return true;
            }
            if (Js._supportWebGL == 1) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Js._supportWebGL = 0;
    return Js;
}(egret.HashObject));
__reflect(Js.prototype, "Js");
window["Js"] = Js;
var Lazy = (function () {
    function Lazy(func) {
    }
    return Lazy;
}());
__reflect(Lazy.prototype, "Lazy");
var ActLite = (function () {
    function ActLite() {
    }
    ActLite.To = function (sx, stateTo, time, onEndFunc, parseHandle) {
        if (time === void 0) { time = 1000; }
        if (onEndFunc === void 0) { onEndFunc = null; }
        if (parseHandle === void 0) { parseHandle = null; }
        var frameCount = time / 30;
        var stateFrom = {};
        for (var fi in stateTo) {
            stateFrom[fi] = sx[fi];
        }
        var stateInterVal = {};
        for (var fi in stateTo) {
            stateInterVal[fi] = (stateTo[fi] - stateFrom[fi]) / frameCount;
        }
        var actId = Strx.Rnd(999999);
        sx.actId = actId;
        var index = 0;
        var interval = function () {
            if (sx.actId != actId) {
                return true;
            }
            if (sx instanceof Sx) {
                if (sx.disposed) {
                    return true;
                }
            }
            else if (sx instanceof Bx) {
                if (sx.disposed) {
                    return true;
                }
            }
            for (var fi in stateTo) {
                if (parseHandle) {
                    sx[fi] = parseHandle(stateInterVal[fi] * index + stateFrom[fi], sx);
                }
                else {
                    sx[fi] = stateInterVal[fi] * index + stateFrom[fi];
                }
            }
            // if (onChangeHandle) {
            //     onChangeHandle(sx);
            // }
            if (index >= frameCount) {
                for (var fi in stateTo) {
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
    };
    //可以向移动的目标移动
    ActLite.ToTarget = function (sx, target, offsetx, offsety, time, onEndFunc) {
        if (time === void 0) { time = 1000; }
        if (onEndFunc === void 0) { onEndFunc = null; }
        var frameCount = time / 30;
        var stateFrom = {};
        stateFrom["x"] = sx.x;
        stateFrom["y"] = sx.y;
        // let stateInterVal = {};
        // for (let fi in stateTo) {
        //     stateInterVal[fi] = (stateTo[fi] - stateFrom[fi]) / frameCount;
        // }
        var actId = Strx.Rnd(999999);
        sx.SetTemp("actId", actId);
        var index = 0;
        var interval = function () {
            if (sx.GetTemp("actId") != actId) {
                return true;
            }
            if (sx instanceof Sx) {
                if (sx.disposed) {
                    return true;
                }
            }
            else if (sx instanceof Bx) {
                if (sx.disposed) {
                    return true;
                }
            }
            var frameCount1 = frameCount - index + 1;
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
    };
    return ActLite;
}());
__reflect(ActLite.prototype, "ActLite");
window["ActLite"] = ActLite;
var AStar = (function () {
    function AStar() {
    }
    AStar.Init = function (dataList) {
        AStar.blocks = dataList;
        if (AStar.blocks) {
            AStar._mapWalkDataMaxX = AStar.blocks.width - 1;
            AStar._mapWalkDataMaxY = AStar.blocks.length - 1;
        }
        ;
    };
    AStar.Find = function (p_start, p_end, isOptimize) {
        if (isOptimize === void 0) { isOptimize = true; }
        if (AStar.blocks.ExistsPoint(p_end)) {
            //找出最近点的end
            var expert = 36;
            var axingOffset = 2;
            var newEnd = null;
            for (var i = 1; i < expert * axingOffset; i += axingOffset) {
                var p = new Vector2(p_end.x - i, p_end.y);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                p = new Vector2(p_end.x + i, p_end.y);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                //
                p = new Vector2(p_end.x, p_end.y - i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                p = new Vector2(p_end.x, p_end.y + i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                //
                p = new Vector2(p_end.x - i, p_end.y - i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                p = new Vector2(p_end.x - i, p_end.y + i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                //
                p = new Vector2(p_end.x + i, p_end.y - i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
                p = new Vector2(p_end.x + i, p_end.y + i);
                if (p.x > 0 && p.x < AStar.blocks.width && p.y > 0 && p.y < AStar.blocks.height && !AStar.blocks.Exists(p.x, p.y)) {
                    newEnd = p;
                    break;
                }
            }
            p_end = newEnd;
            if (p_end == null) {
                return null;
            }
        }
        var aroundPoint;
        var path;
        var f1;
        var f2;
        var n;
        var firstDataInOpen;
        var curPoint;
        if (AStar.blocks == null) {
            return (null);
        }
        ;
        AStar.InitLists();
        AStar._openCount = 0;
        AStar._openId = -1;
        AStar.OpenNote(p_start, 0, 0, 0);
        var tryNum;
        while (AStar._openCount > 0) {
            ++tryNum;
            if (tryNum > AStar.maxTry) {
                AStar.DestroyLists();
                return (null);
            }
            ;
            firstDataInOpen = AStar._openList[0];
            AStar.CloseNote(firstDataInOpen);
            curPoint = AStar._nodeList[firstDataInOpen];
            if (p_end.Equals(curPoint)) {
                path = AStar.GetPath(p_start, firstDataInOpen, isOptimize);
                return (path);
            }
            ;
            AStar.GetArounds(curPoint).forEach(function (aroundPoint) {
                f1 = (AStar._movementCostList[firstDataInOpen] + ((aroundPoint.y == curPoint.y)) ? AStar.COST_STRAIGHT : AStar.COST_DIAGONAL);
                f2 = (f1 + ((Math.abs((p_end.x - aroundPoint.x)) + Math.abs((p_end.y - aroundPoint.y))) * AStar.COST_STRAIGHT));
                if (AStar.IsOpen(aroundPoint)) {
                    n = AStar._noteMap[aroundPoint.y][aroundPoint.x][AStar.NOTE_ID];
                    if (f1 < AStar._movementCostList[n]) {
                        AStar._movementCostList[n] = f1;
                        AStar._pathScoreList[n] = f2;
                        AStar._fatherList[n] = firstDataInOpen;
                        AStar.AheadNote((AStar._openList.indexOf(n) + 1));
                    }
                    ;
                }
                else {
                    AStar.OpenNote(aroundPoint, f2, f1, firstDataInOpen);
                }
                ;
            });
        }
        ;
        AStar.DestroyLists();
        return (null);
    };
    AStar.IncisePath = function (path) {
        var targetPoint;
        var distance;
        var pointIdx = 1;
        var startPoint = path[0];
        while (pointIdx < path.length) {
            targetPoint = path[pointIdx];
            distance = startPoint.Distance(targetPoint);
            if (distance > 8) {
                path.splice(pointIdx, (path.length - pointIdx));
                return;
            }
            ;
            pointIdx++;
        }
        ;
    };
    AStar.IsOpen = function (p) {
        if (AStar._noteMap[p.y] == null) {
            return (false);
        }
        ;
        if (AStar._noteMap[p.y][p.x] == null) {
            return (false);
        }
        ;
        return (AStar._noteMap[p.y][p.x][AStar.NOTE_OPEN]);
    };
    AStar.AheadNote = function (index) {
        var curIdx;
        var n;
        while (index > 1) {
            curIdx = index / 2;
            if (AStar.GetScore(index) < AStar.GetScore(curIdx)) {
                n = AStar._openList[(index - 1)];
                AStar._openList[(index - 1)] = AStar._openList[(curIdx - 1)];
                AStar._openList[(curIdx - 1)] = n;
                index = curIdx;
            }
            else {
                break;
            }
            ;
        }
        ;
    };
    AStar.OpenNote = function (p, score, cost, fatherId) {
        AStar._openCount++;
        AStar._openId++;
        if (AStar._noteMap[p.y] == null) {
            AStar._noteMap[p.y] = [];
        }
        ;
        AStar._noteMap[p.y][p.x] = [];
        AStar._noteMap[p.y][p.x][AStar.NOTE_OPEN] = true;
        AStar._noteMap[p.y][p.x][AStar.NOTE_ID] = AStar._openId;
        AStar._nodeList.push(p);
        AStar._pathScoreList.push(score);
        AStar._movementCostList.push(cost);
        AStar._fatherList.push(fatherId);
        AStar._openList.push(AStar._openId);
        AStar.AheadNote(AStar._openCount);
    };
    AStar.Optimize = function (pointList, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        var curPoint;
        var xx;
        var yy;
        var distance;
        var vx;
        var vy;
        var mx;
        var my;
        var curDistance;
        var canPassLine;
        if (pointList == null) {
            return;
        }
        ;
        var pointCount = (pointList.length - 1);
        if (pointCount < 2) {
            return;
        }
        ;
        var fromPoint = pointList[fromIndex];
        var curIndex = pointCount;
        while (curIndex > fromIndex) {
            curPoint = pointList[curIndex];
            xx = (curPoint.x - fromPoint.x);
            yy = (curPoint.y - fromPoint.y);
            distance = Math.round(Math.sqrt(((xx * xx) + (yy * yy))));
            vx = (xx / distance);
            vy = (yy / distance);
            mx = vx;
            my = vy;
            curDistance = 1;
            canPassLine = true;
            while (curDistance < distance) {
                if (AStar.CanPass(fromPoint.Move(Math.round(mx), Math.round(my))) == false) {
                    canPassLine = false;
                    break;
                }
                ;
                mx = (mx + vx);
                my = (my + vy);
                curDistance++;
            }
            ;
            if (canPassLine) {
                pointList.splice((fromIndex + 1), ((curIndex - fromIndex) - 1));
                break;
            }
            ;
            curIndex--;
        }
        ;
        fromIndex++;
        if (fromIndex < (pointList.length - 1)) {
            AStar.Optimize(pointList, fromIndex);
        }
        ;
    };
    AStar.Optimize2 = function (pointList, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        var curPoint;
        var xx;
        var yy;
        var steps;
        var canPassLine;
        var i;
        var dx;
        var dy;
        var mx;
        var my;
        if (pointList == null) {
            return;
        }
        ;
        var pointCount = (pointList.length - 1);
        if (pointCount < 2) {
            return;
        }
        ;
        var fromPoint = pointList[fromIndex];
        var curIndex = pointCount;
        while (curIndex > fromIndex) {
            curPoint = pointList[curIndex];
            xx = Math.abs((curPoint.x - fromPoint.x));
            yy = Math.abs((curPoint.y - fromPoint.y));
            if (xx > yy) {
                steps = xx;
            }
            else {
                steps = yy;
            }
            ;
            canPassLine = true;
            i = 1;
            while (i < steps) {
                dx = (curPoint.x - fromPoint.x);
                dy = (curPoint.y - fromPoint.y);
                mx = Math.round(((Math.abs(dx) * i) / steps));
                if (dx < 0) {
                    mx = -(mx);
                }
                ;
                my = Math.round(((Math.abs(dy) * i) / steps));
                if (dy < 0) {
                    my = -(my);
                }
                ;
                if (AStar.CanPass(fromPoint.Move(mx, my)) == false) {
                    canPassLine = false;
                    break;
                }
                ;
                i++;
            }
            ;
            if (canPassLine) {
                pointList.splice((fromIndex + 1), ((curIndex - fromIndex) - 1));
                break;
            }
            ;
            curIndex--;
        }
        ;
        fromIndex++;
        if (fromIndex < (pointList.length - 1)) {
            AStar.Optimize2(pointList, fromIndex);
        }
        ;
    };
    AStar.CloseNote = function (id) {
        AStar._openCount--;
        var node = AStar._nodeList[id];
        AStar._noteMap[node.y][node.x][AStar.NOTE_OPEN] = false;
        AStar._noteMap[node.y][node.x][AStar.NOTE_CLOSED] = true;
        if (AStar._openCount <= 0) {
            AStar._openCount = 0;
            AStar._openList.length = 0;
            return;
        }
        ;
        AStar._openList[0] = AStar._openList.pop();
        AStar.BackNote();
    };
    AStar.GetScore = function (index) {
        return (AStar._pathScoreList[AStar._openList[(index - 1)]]);
    };
    AStar.GetArounds = function (p) {
        var nearPoint;
        var point;
        var aroundPointList = [];
        AStar.AROUND_POINTS.forEach(function (point) {
            nearPoint = p.Move(point.x, point.y);
            if (AStar.CanPass(nearPoint)) {
                if (!(AStar.IsClosed(nearPoint))) {
                    aroundPointList.push(nearPoint);
                }
                ;
            }
            ;
        });
        return (aroundPointList);
    };
    AStar.CanPass = function (p) {
        if ((((((((p.x < 0)) || ((p.x > AStar._mapWalkDataMaxX)))) || ((p.y < 0)))) || ((p.y > AStar._mapWalkDataMaxY)))) {
            return (false);
        }
        ;
        return !AStar.blocks.ExistsPoint(p);
    };
    AStar.GetPath = function (p_start, id, isOptimize) {
        var pathNodeList = [];
        var node = AStar._nodeList[id];
        while (!(p_start.Equals(node))) {
            pathNodeList.push(node);
            id = AStar._fatherList[id];
            node = AStar._nodeList[id];
        }
        ;
        pathNodeList.push(p_start);
        AStar.DestroyLists();
        pathNodeList.reverse();
        if (isOptimize) {
            AStar.Optimize2(pathNodeList);
        }
        ;
        return (pathNodeList);
    };
    AStar.InitLists = function () {
        AStar._openList = [];
        AStar._nodeList = [];
        AStar._pathScoreList = [];
        AStar._movementCostList = [];
        AStar._fatherList = [];
        AStar._noteMap = new Array();
    };
    AStar.IsClosed = function (p) {
        if (AStar._noteMap[p.y] == null) {
            return (false);
        }
        ;
        if (AStar._noteMap[p.y][p.x] == null) {
            return (false);
        }
        ;
        return (AStar._noteMap[p.y][p.x][AStar.NOTE_CLOSED]);
    };
    AStar.DestroyLists = function () {
        AStar._openList = null;
        AStar._nodeList = null;
        AStar._pathScoreList = null;
        AStar._movementCostList = null;
        AStar._fatherList = null;
        AStar._noteMap = null;
    };
    AStar.BackNote = function () {
        var temp;
        var n1;
        var n2 = 1;
        while (true) {
            n1 = n2;
            if ((2 * n1) <= AStar._openCount) {
                if (AStar.GetScore(n2) > AStar.GetScore((2 * n1))) {
                    n2 = (2 * n1);
                }
                ;
                if (((2 * n1) + 1) <= AStar._openCount) {
                    if (AStar.GetScore(n2) > AStar.GetScore(((2 * n1) + 1))) {
                        n2 = ((2 * n1) + 1);
                    }
                    ;
                }
                ;
            }
            ;
            if (n1 == n2) {
                break;
            }
            ;
            temp = AStar._openList[(n1 - 1)];
            AStar._openList[(n1 - 1)] = AStar._openList[(n2 - 1)];
            AStar._openList[(n2 - 1)] = temp;
        }
        ;
    };
    AStar.BLOCK_WAY = 1;
    AStar.AROUND_POINTS = [new Vector2(1, 0),
        new Vector2(0, 1),
        new Vector2(-1, 0),
        new Vector2(0, -1),
        new Vector2(1, 1),
        new Vector2(-1, 1),
        new Vector2(-1, -1),
        new Vector2(1, -1)];
    AStar.COST_DIAGONAL = 14;
    AStar.COST_STRAIGHT = 10;
    AStar.NOTE_OPEN = 1;
    AStar.NOTE_ID = 0;
    AStar.NOTE_CLOSED = 2;
    AStar.maxTry = 5000;
    return AStar;
}());
__reflect(AStar.prototype, "AStar");
window["AStar"] = AStar;
var Msg = (function () {
    function Msg() {
    }
    Msg.Call = function (name, val) {
        try {
            if (Msg.list.Exists(name)) {
                var actList = Msg.list[name];
                actList.Each(function (fi) {
                    try {
                        Msg.Fun(fi, val);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                });
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
    };
    Msg.Fun = function (fi, val) {
        NForm.LazyCall(function () {
            if (fi) {
                fi(val);
            }
        });
    };
    Msg.Listen = function (name, act, sx) {
        // Js.Trace(name);
        // Js.Trace(act);
        if (!Msg.list.Exists(name)) {
            Msg.list[name] = new Arr();
        }
        var arr = Msg.list[name];
        arr.Add(act);
        if (sx) {
            sx.OnDispose(function () {
                arr.Remove(act);
            });
        }
    };
    Msg.list = new Listx();
    return Msg;
}());
__reflect(Msg.prototype, "Msg");
window["Msg"] = Msg;
// interface Object {//Object不能扩展
//     ToInt(): number;
// }
// if (!Object.prototype.ToInt) {
//     Object.prototype.ToInt = function () {
//         return this.toString().ToInt();
//     };
// }
if (!Number.prototype.ToInt) {
    Number.prototype.ToInt = function () {
        return parseInt(this);
    };
}
if (!Number.prototype.Max) {
    Number.prototype.Max = function (val1) {
        return Math.max(this, val1);
    };
}
if (!Number.prototype.Min) {
    Number.prototype.Min = function (val1) {
        return Math.min(this, val1);
    };
}
if (!Number.prototype.Clamp) {
    Number.prototype.Clamp = function (min, max) {
        return Math.min(Math.max(this, min), max);
    };
}
// egret.MovieClipData.prototype.getTextureByFrame = function (frame) {
//     if (frame) {
//         var frameData = this.getKeyFrameData(frame);
//         if (frameData) {
//             if (frameData.res) {
//                 var outputTexture = this.getTextureByResName(frameData.res);
//                 return outputTexture;
//             }
//         }
//     }
//     return null;
// }; 
var Point = (function (_super) {
    __extends(Point, _super);
    function Point(x, y) {
        return _super.call(this, x, y) || this;
    }
    return Point;
}(egret.Point));
__reflect(Point.prototype, "Point");
window["Point"] = Point;
var Prototype = (function () {
    function Prototype() {
    }
    return Prototype;
}());
__reflect(Prototype.prototype, "Prototype");
Array.prototype["Each"] = function (func) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (func(this[i])) {
            break;
        }
    }
};
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, width, height) {
        return _super.call(this, x, y, width, height) || this;
    }
    return Rectangle;
}(egret.Rectangle));
__reflect(Rectangle.prototype, "Rectangle");
window["Rectangle"] = Rectangle;
// ///<reference path="Dictionary.ts" />
// class SafeTimer {
//     public static _fps: number = 0;
//     public static fps: Listx = new Listx();
//     public static stage: egret.Stage;
//     public static loaded: boolean = false;
//     public static Load(stage: egret.Stage) {
//         if(!SafeTimer.loaded) {
//             SafeTimer.stage = stage;
//             stage.addEventListener(egret.Event.ENTER_FRAME,SafeTimer.EnterFrame,null);
//             //stage.addEventListener(egret.Event.RENDER,SafeTimer.Render,null);
//             SafeTimer.Add(1500,SafeTimer.HandleAutoHide);
//             SafeTimer.loaded = true;
//         }
//     }
//     public static Add(interval: number,func: Function) {
//         SafeTimer.staticObjCount++;
//         var timer: egret.Timer = new egret.Timer(interval);
//         var act: Function =function(ev: egret.TimerEvent) {
//             if(stop) {
//                 return;
//             }
//             var stop: boolean =func();
//             if(stop) {
//                 timer.removeEventListener(egret.TimerEvent.TIMER,act,null);
//                 timer.stop();
//                 SafeTimer.staticObjCount--;
//             }
//         };
//         timer.addEventListener(egret.TimerEvent.TIMER,act,null);
//         timer.start();
//     }
//     public static staticObjCount: number = 0;
//     public static staticTimerDic: Dictionary = new Dictionary();
//     public static AddStatic(interval: number,func: Function) {
//         if(!SafeTimer.staticTimerDic.Get(interval.toString())) {
//             SafeTimer.staticTimerDic.Set(interval,new Array<Function>());
//             SafeTimer.Add(interval,function(): boolean {
//                 if(stop) {
//                     return false;
//                 }
//                 var arr: Array<Function> = SafeTimer.staticTimerDic.Get(interval.toString());
//                 for(var fi_key_a in arr) {
//                     var fi: Function = arr[fi_key_a];
//                     var stop: boolean = false;
//                     SafeTimer.Try(function() {
//                         if(fi()) {
//                             stop = true;
//                         }
//                     },false);
//                     if(stop) {
//                         var index: number = arr.indexOf(fi);
//                         if(index > -1) {
//                             arr.splice(index,1);
//                             SafeTimer.staticObjCount--;
//                             continue;
//                         }
//                     }
//                 }
//                 return false;
//             });
//         }
//         SafeTimer.staticTimerDic.Get(interval.toString()).push(func);
//         SafeTimer.staticObjCount++;
//     }
//     public static AddRepeat(interval: number,repeatCount: number,func: Function,complete: Function = null) {
//         var timer: egret.Timer = new egret.Timer(interval,repeatCount);
//         var act1: Function =function(ev: egret.TimerEvent) {
//             if(SafeTimer.stop) {
//                 return;
//             }
//             func();
//         };
//         var act2: Function =function(ev: egret.TimerEvent) {
//             complete();
//             timer.removeEventListener(egret.TimerEvent.TIMER,act1,null);
//             timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE,act2,null);
//             timer.stop();
//             SafeTimer.staticObjCount--;
//         };
//         timer.addEventListener(egret.TimerEvent.TIMER,act1,null);
//         timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,act2,null);
//         timer.start();
//         SafeTimer.staticObjCount++;
//     }
//     public static SetTimeout(interval: number,func: Function) {
//         var timer: egret.Timer = new egret.Timer(interval,1);
//         var act: Function =function(ev: egret.TimerEvent) {
//             if(SafeTimer.stop) {
//                 return;
//             }
//             func();
//             timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE,act,null);
//             SafeTimer.staticObjCount--;
//         };
//         timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,act,null);
//         timer.start();
//         SafeTimer.staticObjCount++;
//     }
//     public static dic: Dictionary = new Dictionary();
//     public static LazyCall(name: any,state: any = null) {
//         if(state == null) {
//             SafeTimer.dic.Set(name,name);
//         }
//         else {
//             if(!SafeTimer.dic.Exists(name)) {
//                 SafeTimer.dic.Set(name,state);
//             }
//             else {
//                 var state1: any = SafeTimer.dic.Get(name);
//                 for(var key in state) {
//                     state1[key] = state[key];
//                 }
//             }
//         }
//         if(!SafeTimer.loaded) {
//             SafeTimer.EnterFrame(null);
//         }
//     }
//     public static EnterFrame(ev: egret.Event) {
//         SafeTimer._fps++;
//         if(SafeTimer.stop) {
//             return;
//         }
//         SafeTimer.dic.EachKey((fi) => {
//             var state: any = SafeTimer.dic.Get(fi);
//             if(state instanceof Function) {
//                 SafeTimer.Try(function() {
//                     state();
//                 });
//             }
//             else {
//                 for(var key in state) {
//                     SafeTimer.Try(function() {
//                         fi[key] = state[key];
//                     },false);
//                 }
//             }
//             SafeTimer.dic.Set(fi,null);       
//             SafeTimer.dic.Remove(fi);
//         });
//     }
//     public static Render(ev: egret.Event) {
//     }
//     public static Try(func: Function,willLog: boolean = false) {
//         if(Js.showTrace) {
//             func();
//             if(willLog) {
//                 var ex: Error = new Error();
//                 Js.Trace("-----------------------" + ex.message.replace(/\n/g,"***").replace(/ /g," "));
//             }
//         }
//         else {
//             try {
//                 func();
//             }
//             catch(ex)
//             { }
//         }
//     }
//     public static AddHandleAutoHide(sx: Ix) {
//         SafeTimer.autoHideList.push(sx);
//     }
//     public static autoHideList: Array<Ix>;
//     public static HandleAutoHide(): boolean {
//         SafeTimer.fps["fps"] = SafeTimer._fps * 2 / 3;
//         SafeTimer._fps = 0
//         var count: number = 0;
//         for(var sx_key_a in SafeTimer.autoHideList) {
//             var sx: any = SafeTimer.autoHideList[sx_key_a];
//             if(sx.disposed) {
//                 var index: number = SafeTimer.autoHideList.indexOf(sx);
//                 if(index > -1) {
//                     SafeTimer.autoHideList.splice(index,1);
//                 }
//             }
//             else {
//                 if(sx.showTop50 && count >= 50) {
//                     sx.HandleAutoHide_Hide();
//                 }
//                 else {
//                     var rv: boolean =sx.HandleAutoHide();
//                     if(rv) {
//                         if(sx.showTop50) {
//                             count++;
//                         }
//                     }
//                 }
//             }
//         }
//         return false;
//     }
//     public static stop: boolean;
//     public static StopAllSafeTimer() {
//         SafeTimer.stop = true;
//     }
// }
var Server = (function () {
    function Server() {
    }
    Server.SetFile = function (path, val) {
        // if (Config.business == "WX") {
        //     try {
        //         platform.setStorageSync(path, val);
        //     } catch (ex) {
        //         Js.Trace(ex);
        //     }
        // } else {
        try {
            egret.localStorage.setItem(path, val);
        }
        catch (ex) {
            Js.Trace(ex);
        }
        //}
    };
    Server.GetFile = function (path) {
        // if (Config.business == "WX") {
        //     try {
        //         platform.getStorageSync(path);
        //     } catch (ex) {
        //         Js.Trace(ex);
        //     }
        // } else {
        try {
            var rv = egret.localStorage.getItem(path);
            if (rv == null) {
                rv = "";
            }
            return rv;
        }
        catch (ex) {
            Js.Trace(ex);
        }
        //}
        return "";
    };
    Server.GetIO = function (path) {
        return Server.GetFile(path);
    };
    Server.SetIO = function (path, val) {
        Server.SetFile(path, val);
    };
    Server.GC = function () {
        //TODO;
    };
    Server.CreateClass = function (c) {
        if (Js.showTrace) {
            var s = new c();
            s.OnDispose(function () {
                c.instance = null;
            });
            return s;
        }
        else {
            try {
                var s = new c();
                s.OnDispose(function () {
                    c.instance = null;
                });
                return s;
            }
            catch (ex) { }
            return null;
        }
    };
    Object.defineProperty(Server, "Now", {
        get: function () {
            return Time.Now;
        },
        enumerable: true,
        configurable: true
    });
    return Server;
}());
__reflect(Server.prototype, "Server");
window["Server"] = Server;
var SHA1 = (function () {
    function SHA1() {
        this.hexcase = 0;
        this.b64pad = "";
    }
    SHA1.GI = function () {
        if (!SHA1._instance) {
            SHA1._instance = new SHA1();
        }
        return SHA1._instance;
    };
    SHA1.prototype.hex_sha1 = function (s) { return this.rstr2hex(this.rstr_sha1(this.str2rstr_utf8(s))); };
    SHA1.prototype.b64_sha1 = function (s) { return this.rstr2b64(this.rstr_sha1(this.str2rstr_utf8(s))); };
    SHA1.prototype.any_sha1 = function (s, e) { return this.rstr2any(this.rstr_sha1(this.str2rstr_utf8(s)), e); };
    SHA1.prototype.hex_hmac_sha1 = function (k, d) { return this.rstr2hex(this.rstr_hmac_sha1(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
    SHA1.prototype.b64_hmac_sha1 = function (k, d) { return this.rstr2b64(this.rstr_hmac_sha1(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
    SHA1.prototype.any_hmac_sha1 = function (k, d, e) { return this.rstr2any(this.rstr_hmac_sha1(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); };
    SHA1.prototype.sha1_vm_test = function () {
        return this.hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
    };
    SHA1.prototype.rstr_sha1 = function (s) {
        return this.binb2rstr(this.binb_sha1(this.rstr2binb(s), s.length * 8));
    };
    SHA1.prototype.rstr_hmac_sha1 = function (key, data) {
        var bkey = this.rstr2binb(key);
        if (bkey.length > 16)
            bkey = this.binb_sha1(bkey, key.length * 8);
        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        var hash = this.binb_sha1(ipad.concat(this.rstr2binb(data)), 512 + data.length * 8);
        return this.binb2rstr(this.binb_sha1(opad.concat(hash), 512 + 160));
    };
    SHA1.prototype.rstr2hex = function (input) {
        try {
            this.hexcase;
        }
        catch (e) {
            this.hexcase = 0;
        }
        var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var output = "";
        var x;
        for (var i = 0; i < input.length; i++) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
        }
        return output;
    };
    SHA1.prototype.rstr2b64 = function (input) {
        try {
            this.b64pad;
        }
        catch (e) {
            this.b64pad = '';
        }
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var output = "";
        var len = input.length;
        for (var i = 0; i < len; i += 3) {
            var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > input.length * 8)
                    output += this.b64pad;
                else
                    output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
        }
        return output;
    };
    SHA1.prototype.rstr2any = function (input, encoding) {
        var divisor = encoding.length;
        var remainders = Array();
        var i, q, x, quotient;
        var dividend = Array(Math.ceil(input.length / 2));
        for (i = 0; i < dividend.length; i++) {
            dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
        }
        while (dividend.length > 0) {
            quotient = Array();
            x = 0;
            for (i = 0; i < dividend.length; i++) {
                x = (x << 16) + dividend[i];
                q = Math.floor(x / divisor);
                x -= q * divisor;
                if (quotient.length > 0 || q > 0)
                    quotient[quotient.length] = q;
            }
            remainders[remainders.length] = x;
            dividend = quotient;
        }
        var output = "";
        for (i = remainders.length - 1; i >= 0; i--)
            output += encoding.charAt(remainders[i]);
        var full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
        for (i = output.length; i < full_length; i++)
            output = encoding[0] + output;
        return output;
    };
    SHA1.prototype.str2rstr_utf8 = function (input) {
        var output = "";
        var i = -1;
        var x, y;
        while (++i < input.length) {
            x = input.charCodeAt(i);
            y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
            if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                i++;
            }
            if (x <= 0x7F)
                output += String.fromCharCode(x);
            else if (x <= 0x7FF)
                output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
            else if (x <= 0xFFFF)
                output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            else if (x <= 0x1FFFFF)
                output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        }
        return output;
    };
    SHA1.prototype.str2rstr_utf16le = function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
        return output;
    };
    SHA1.prototype.str2rstr_utf16be = function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
        return output;
    };
    SHA1.prototype.rstr2binb = function (input) {
        var output = Array(input.length >> 2);
        for (var i = 0; i < output.length; i++)
            output[i] = 0;
        for (var i = 0; i < input.length * 8; i += 8)
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
        return output;
    };
    SHA1.prototype.binb2rstr = function (input) {
        var output = "";
        for (var i = 0; i < input.length * 32; i += 8)
            output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
        return output;
    };
    SHA1.prototype.binb_sha1 = function (x, len) {
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;
        var w = Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;
            for (var j = 0; j < 80; j++) {
                if (j < 16)
                    w[j] = x[i + j];
                else
                    w[j] = this.bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                var t = this.safe_add(this.safe_add(this.bit_rol(a, 5), this.sha1_ft(j, b, c, d)), this.safe_add(this.safe_add(e, w[j]), this.sha1_kt(j)));
                e = d;
                d = c;
                c = this.bit_rol(b, 30);
                b = a;
                a = t;
            }
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
            e = this.safe_add(e, olde);
        }
        return [a, b, c, d, e];
    };
    SHA1.prototype.sha1_ft = function (t, b, c, d) {
        if (t < 20)
            return (b & c) | ((~b) & d);
        if (t < 40)
            return b ^ c ^ d;
        if (t < 60)
            return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d;
    };
    SHA1.prototype.sha1_kt = function (t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
            (t < 60) ? -1894007588 : -899497514;
    };
    SHA1.prototype.safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };
    SHA1.prototype.bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };
    return SHA1;
}());
__reflect(SHA1.prototype, "SHA1");
window["SHA1"] = SHA1;
var SingleQueue = (function () {
    function SingleQueue(act, timeout) {
        if (timeout === void 0) { timeout = 800; }
        this.inHandle = false;
        this.index = 0;
        this.continueCount = 0;
        this.act = act;
        this.timeout = timeout;
        this.handleQueue = new Array();
    }
    SingleQueue.prototype.Push = function (item) {
        if (!this.inHandle) {
            try {
                this.Add(item);
            }
            catch (ex) {
                Js.Trace(ex);
            }
        }
        else {
            this.En(item);
        }
    };
    SingleQueue.prototype.Add = function (item) {
        try {
            if (this.inHandle) {
                this.handleQueue.push(item);
            }
            else {
                this.inHandle = true;
                this.Handle(item);
            }
        }
        catch (ex) {
            this.inHandle = false;
            Js.Trace(ex);
        }
    };
    SingleQueue.prototype.En = function (item) {
        this.handleQueue.push(item);
    };
    SingleQueue.prototype.Handle = function (item) {
        if (item == null) {
            this.inHandle = false;
            this.index = 0;
            return;
        }
        try {
            this.act(item);
            this.index++;
        }
        catch (ex) {
            Js.Trace(ex);
        }
        if (this.index >= this.continueCount) {
            this.inHandle = false;
            this.index = 0;
            return;
        }
        else {
            var items = this.handleQueue.splice(0, 1);
            if (items.length > 0) {
                this.Handle(items[0]);
            }
        }
    };
    SingleQueue.prototype.End = function () {
        this.inHandle = true;
        while (true) {
            var items = this.handleQueue.splice(0, 1);
            if (items.length == 0) {
                return;
            }
            try {
                this.act(items[0]);
            }
            catch (ex) {
                Js.Trace(ex);
            }
        }
    };
    return SingleQueue;
}());
__reflect(SingleQueue.prototype, "SingleQueue");
window["SingleQueue"] = SingleQueue;
var Sp = (function (_super) {
    __extends(Sp, _super);
    function Sp(val) {
        return _super.call(this, val) || this;
    }
    return Sp;
}(Bx));
__reflect(Sp.prototype, "Sp");
window["Sp"] = Sp;
var Src = (function () {
    function Src() {
    }
    Src.ReadByte = function (path, urlLoaded, errorFunc) {
        if (errorFunc === void 0) { errorFunc = null; }
        // let loader: egret.URLLoader = new egret.URLLoader();
        // loader.dataFormat = egret.URLLoaderDataFormat.BINARY;
        // loader.addEventListener(egret.Event.COMPLETE, (ev: any) => {
        //     urlLoaded(ev.target.data);
        // }, this);
        // if (errorFunc ) {
        //     loader.addEventListener(egret.IOErrorEvent.IO_ERROR, errorFunc, this);
        // }
        // loader.load(new egret.URLRequest("resource/" + path));
        var url = path;
        if (!path.StartWith("http")) {
            url = "resource/" + path;
        }
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
        var respHandler = function (evt) {
            switch (evt.type) {
                case egret.Event.COMPLETE:
                    var request_1 = evt.currentTarget;
                    var ab = request_1.response;
                    urlLoaded(ab);
                    break;
                case egret.IOErrorEvent.IO_ERROR:
                    urlLoaded(null);
                    break;
            }
        };
        request.once(egret.Event.COMPLETE, respHandler, null);
        request.once(egret.IOErrorEvent.IO_ERROR, respHandler, null);
        request.open(url, egret.HttpMethod.GET);
        request.send();
    };
    // public static readQueue: SingleQueue = new SingleQueue((item) => {
    //     if (Js.showTrace) {
    //         // ("ReadUrl:" + path).WriteLog();
    //     }
    //     let url = "resource/" + item.path;
    //     let imageLoader = new egret.ImageLoader();
    //     imageLoader.once(egret.Event.COMPLETE, onLoadComplete, null);
    //     imageLoader.once(egret.IOErrorEvent.IO_ERROR, onError, null);
    //     imageLoader.load(url);
    //     function onError(event) {
    //         item.urlLoaded(null);
    //         Src.dataCacheList[item.path] = null;
    //         Src.inreadingDataCacheList[item.path].forEach((fi) => {
    //             fi(null);
    //         });
    //         Src.inreadingDataCacheList.Remove(item.path);
    //         ("ReadErrorUrl:" + item.path).WriteLog();
    //     }
    //     function onLoadComplete(evt: egret.Event) {
    //         let data = evt.currentTarget.data;
    //         let texture = new egret.Texture();
    //         texture._setBitmapData(data);
    //         Src.dataCacheList[item.path] = texture;
    //         Src.inreadingDataCacheList[item.path].forEach((fi) => {
    //             fi(texture);
    //         });
    //         Src.inreadingDataCacheList.Remove(item.path);
    //     }
    // }, 800);
    Src.Read = function (path, urlLoaded) {
        if (path == null || path.IsEmpty()) {
            urlLoaded(null);
            return;
        }
        if (Src.dataCacheList.Exists(path)) {
            if (Src.dataCacheList[path]) {
                var texture = Src.dataCacheList[path];
                // let texture = new egret.Texture();
                // let data = Src.dataCacheList[path];
                // Js.Trace(Src.dataCacheList[path]);
                // texture._setBitmapData(Src.dataCacheList[path]);
                //Form.LazyCall(() => {
                urlLoaded(texture);
                //});
            }
            else {
                urlLoaded(null);
            }
            return;
        }
        if (Src.inreadingDataCacheList.Exists(path)) {
            Src.inreadingDataCacheList[path].push(urlLoaded);
            return;
        }
        Src.inreadingDataCacheList[path] = [];
        Src.inreadingDataCacheList[path].push(urlLoaded);
        //Src.readQueue.Push({ path: path, urlLoaded: urlLoaded, willCache: willCache });
        // if (Js.showTrace) {
        //     ("ReadUrl:" + path).WriteLog();
        // }
        var item = { path: path, urlLoaded: urlLoaded };
        var url = item.path;
        if (!item.path.StartWith("http")) {
            url = "resource/" + item.path;
        }
        var imageLoader = new egret.ImageLoader();
        imageLoader.once(egret.Event.COMPLETE, onLoadComplete, null);
        imageLoader.once(egret.IOErrorEvent.IO_ERROR, onError, null);
        imageLoader.load(url);
        function onError(event) {
            item.urlLoaded(null);
            Src.dataCacheList[item.path] = null;
            Src.inreadingDataCacheList[item.path].forEach(function (fi) {
                fi(null);
            });
            Src.inreadingDataCacheList.Remove(item.path);
            ("ReadErrorUrl:" + item.path).WriteLog();
        }
        function onLoadComplete(evt) {
            var data = evt.currentTarget.data;
            var texture = new egret.Texture();
            texture._setBitmapData(data);
            var texures = Textures.GetTextures(texture, item.path);
            Src.dataCacheList[item.path] = texures;
            Src.inreadingDataCacheList[item.path].forEach(function (fi) {
                fi(texures);
            });
            Src.inreadingDataCacheList.Remove(item.path);
        }
    };
    Src.ReadTxt = function (path, urlLoaded, willCache) {
        if (willCache === void 0) { willCache = true; }
        if (path == null || path.IsEmpty()) {
            urlLoaded(null);
            return;
        }
        if (willCache && Src.textCacheList.Exists(path)) {
            urlLoaded(Src.textCacheList[path]);
            return;
        }
        if (Src.inreadingDataCacheList.Exists(path)) {
            Src.inreadingDataCacheList[path].push(urlLoaded);
            return;
        }
        Src.inreadingDataCacheList[path] = [];
        Src.inreadingDataCacheList[path].push(urlLoaded);
        // if (Js.showTrace) {
        //     ("ReadUrl:" + path).WriteLog();
        // }
        var url = path;
        if (!path.StartWith("http")) {
            url = "resource/" + path;
        }
        var request = new egret.HttpRequest();
        var respHandler = function (evt) {
            switch (evt.type) {
                case egret.Event.COMPLETE:
                    var request_2 = evt.currentTarget;
                    Src.textCacheList[path] = request_2.response;
                    Src.inreadingDataCacheList[path].forEach(function (fi) {
                        fi(request_2.response);
                    });
                    Src.inreadingDataCacheList.Remove(path);
                    break;
                case egret.IOErrorEvent.IO_ERROR:
                    Src.inreadingDataCacheList[path].forEach(function (fi) {
                        fi("");
                    });
                    Src.inreadingDataCacheList.Remove(path);
                    ("ReadErrorUrl:" + path).WriteLog();
                    break;
            }
        };
        // let progressHandler = function( evt:egret.ProgressEvent ):void{
        //     console.log( "progress:", evt.bytesLoaded, evt.bytesTotal );
        // }
        request.once(egret.Event.COMPLETE, respHandler, null);
        request.once(egret.IOErrorEvent.IO_ERROR, respHandler, null);
        //request.once(egret.ProgressEvent.PROGRESS, progressHandler, null);
        request.open(url, egret.HttpMethod.GET);
        request.send();
    };
    Src.ReadXml = function (path, urlLoaded, willCache) {
        if (willCache === void 0) { willCache = true; }
        Src.ReadTxt(path, function (res) {
            console.log(res);
            if (res.IsEmpty()) {
                urlLoaded(null);
            }
            else {
                urlLoaded(new Xml(res));
            }
        }, willCache);
    };
    Src.Load = function (func) {
        //if (Js.showTrace) {//这里最好能Config配置
        var data = RES.getRes("ModelFlexAttribute_txt"); //增加载入速度
        if (data) {
            var buffer = Strx.Decompress(new Uint8Array(data));
            var text = UTF8.decode(buffer);
            Src.modelFlexList = Listx.Arr(text);
            Src.modelFlexList.EachKey(function (fi) {
                Js.Trace(fi + ":" + Src.modelFlexList[fi].length);
            });
        }
        func();
        // } else {
        //     Src.ReadByte("Res/data/ModelFlexAttribute.txt", ((data: ArrayBuffer) => {//外网可能会需要热更
        //         let buffer = Strx.Decompress(new Uint8Array(data));
        //         let text = UTF8.decode(buffer);
        //         Src.modelFlexList = Listx.Arr(text);
        //         Src.modelFlexList.EachKey((fi) => {
        //             Js.Trace(fi + ":" + Src.modelFlexList[fi].length);
        //         });
        //         func();
        //     }));
        // }
    };
    Src.dataCacheList = new Listx();
    Src.inreadingDataCacheList = new Listx();
    Src.textCacheList = new Listx();
    return Src;
}());
__reflect(Src.prototype, "Src");
window["Src"] = Src;
var Config = (function () {
    function Config() {
    }
    Object.defineProperty(Config, "shareIco", {
        get: function () {
            return Config.shareIcos[Strx.Rnd(Config.shareIcos.length)];
        },
        enumerable: true,
        configurable: true
    });
    Config.LoadConfig = function (xml, func) {
        console.log("Begin Load Config");
        //Config.dic = new Listx();
        var nodes = xml.nodes;
        Config.dic = nodes[0];
        var redirect = Config.dic["redirect"];
        if (redirect) {
            Src.ReadXml(redirect, function (xml1) {
                if (xml1 == null) {
                    NForm.SetTimeout(800, function () {
                        Config.LoadConfig(xml, func);
                    });
                }
                else {
                    Config.LoadConfig(xml1, func);
                }
            });
            return;
        }
        Config.showTrace = Config.dic["showTrace"];
        Js.showTrace = (Config.showTrace == "1");
        Config.test = Config.dic["test"];
        Config.qq = Config.dic["qq"];
        Config.qqq = Config.dic["qqq"]; //QQ群
        Config.allShopGoods = Config.dic["allShopGoods"];
        if (Config.dic["url"]) {
            Config.urls = Config.dic["url"].split(",");
            Config.urls = Config.urls.sort(function (a, b) {
                return Strx.Rnd(10);
            });
        }
        Config.gameUrl = Config.dic["gameUrl"];
        Config.payUrl = Config.dic["payUrl"];
        Config.shareUrl = Config.dic["shareUrl"];
        Config.src = Config.dic["src"];
        Config.version = Config.dic["version"];
        Config.icoPath = Config.dic["icoPath"];
        Config.srcPath = Config.dic["srcPath"];
        Config.game = Config.dic["game"];
        Config.isLW = Config.game == "Longwen";
        Config.cardMode = Config.dic["cardMode"] == "1";
        Config.app = Config.dic["app"];
        Config.shareApp = Config.dic["shareApp"];
        Config.serverIp = Config.dic["serverIp"];
        Config.port = Config.dic["port"];
        Config.portHttp = Config.dic["portHttp"];
        Config.serverName = Config.dic["serverName"];
        Config.serverBegin = Config.dic["serverBegin"];
        Config.serverFrom = Config.dic["serverFrom"];
        Config.ps = Config.dic["ps"] == "1";
        Config.closeChat = Config.dic["closeChat"] == "1";
        Config.serverId = Config.dic["serverId"];
        Config.newServerMode = Config.dic["newServerMode"] == "1";
        Config.wss = Config.dic["wss"];
        Config.gonggao = Config.dic["gonggao"];
        Config.isBattleCard = Config.dic["isBattleCard"] == "1";
        Config.isStyleCard = Config.dic["isStyleCard"] == "1";
        Config.btServer = Config.dic["btServer"] == "1";
        if (Config.dic["mainCenter"]) {
            Config.mainCenter = Config.dic["mainCenter"].ToInt();
        }
        if (Config.dic["gameType"]) {
            Config.gameType = Config.dic["gameType"].ToInt();
        }
        Config.ads = Config.dic["ads"];
        Config.banner = Config.dic["banner"];
        Config.banner2 = Config.dic["banner2"];
        if (Config.dic["bannery"]) {
            Config.bannery = Config.dic["bannery"].ToInt();
        }
        Config.outAds = Config.dic["outAds"] == "1";
        Config.openAds = Config.dic["openAds"] == "1";
        Config.appMode = Config.dic["appMode"] == "1";
        Config.inExam = Config.dic["inExam"] == "1";
        Config.autoCreateRole = Config.dic["autoCreateRole"] == "1";
        if (Config.dic["bbs"]) {
            Config.bbs = Config.dic["bbs"];
        }
        if (Config.dic["alert"]) {
            Config.alert = Config.dic["alert"];
        }
        if (Config.dic["alertOld"]) {
            Config.alertOld = Config.dic["alertOld"];
        }
        var servers = Config.dic["servers"];
        if (servers) {
            var ss = servers.split(',');
            var server = ss[Strx.Rnd(ss.length)];
            var ss1 = server.split(':');
            Config.serverIp = ss1[0];
            Config.port = ss1[1].ToInt();
        }
        var serversTls13 = Config.dic["serversTls13"];
        if (serversTls13) {
            var ss = serversTls13.split(',');
            var server = ss[Strx.Rnd(ss.length)];
            var ss1 = serversTls13.split(':');
            Config.serverIpTls13 = ss1[0];
            Config.portTls13 = ss1[1].ToInt();
        }
        Config.share = Config.dic["share"];
        if (!Config.share) {
            Config.share = "我正在种菜，缺少辣椒，请求帮助！";
        }
        if (Config.dic["shareIco"]) {
            Config.shareIcos = Config.dic["shareIco"].split(',');
        }
        else {
            Config.shareIcos = ["share/shares.jpg"];
        }
        Config.tujian = Config.dic["tujian"];
        var business = Config.dic["business"];
        var business1 = Js.GetUrlParm("business");
        if (business1 && business1 != "") {
            business = business1;
        }
        Config.businessType = business;
        console.log("End Load Config");
        func();
    };
    Config.isLW = false;
    Config.cardMode = false;
    Config.outAds = false; //外部广告（跳转到其他小程序）
    Config.alert = ""; //进入游戏的公告
    Config.alertOld = ""; //进入游戏的公告
    Config.appMode = false; //是不是app模式
    Config.inExam = false;
    Config.autoCreateRole = false;
    Config.bbs = "";
    return Config;
}());
__reflect(Config.prototype, "Config");
window["Config"] = Config;
var TaskQueue = (function () {
    function TaskQueue(timeout, onIdle) {
        if (timeout === void 0) { timeout = 100; }
        if (onIdle === void 0) { onIdle = null; }
        this.timeout = 100;
        this.queue = new Array();
        this.inHandle = false;
        this.disposed = false;
        this.timeout = timeout;
        this.onIdle = onIdle;
    }
    TaskQueue.prototype.AddQueue = function (func) {
        if (this.inHandle) {
            this.queue.push(func);
        }
        else {
            this.Handle(func);
        }
    };
    TaskQueue.prototype.Handle = function (func) {
        var _this = this;
        if (func === void 0) { func = null; }
        this.inHandle = true;
        if (func == null) {
            if (this.queue.length > 0) {
                func = this.queue.splice(0, 1)[0];
            }
            else {
                this.inHandle = false;
                if (this.onIdle) {
                    this.onIdle();
                }
            }
        }
        if (func) {
            try {
                if (typeof func === 'function') {
                    if (func()) {
                        NForm.SetTimeout(this.timeout, function () {
                            _this.Next();
                        });
                    }
                }
                else if (func.hasOwnProperty("func")) {
                    if (func["func"]()) {
                        NForm.SetTimeout(this.timeout, function () {
                            _this.Next();
                        });
                    }
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
        }
    };
    TaskQueue.prototype.Next = function () {
        this.Handle();
    };
    TaskQueue.prototype.Dispose = function () {
        var that = this;
        if (!this.disposed) {
            this.disposed = true;
        }
    };
    return TaskQueue;
}());
__reflect(TaskQueue.prototype, "TaskQueue");
window["TaskQueue"] = TaskQueue;
var Textures = (function () {
    function Textures(texture, path) {
        if (path === void 0) { path = ""; }
        this.disposed = false;
        this.tick = 0;
        this.texture = texture;
        this.path = path;
    }
    Object.defineProperty(Textures.prototype, "bitmapWidth", {
        get: function () {
            return this.texture.$bitmapWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Textures.prototype, "bitmapHeight", {
        get: function () {
            return this.texture.$bitmapHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Textures.prototype, "bitmapData", {
        get: function () {
            return this.texture.$bitmapData;
        },
        enumerable: true,
        configurable: true
    });
    Textures.prototype.GetTexture = function () {
        return this.texture;
    };
    Textures.prototype.UseTexture = function (bx) {
        if (bx.textures) {
            bx.textures.tick--;
        }
        this.tick++;
        bx.textures = this;
        return this;
    };
    Textures.prototype.UnUseTexture = function () {
        this.tick--;
    };
    Textures.prototype.Keep = function () {
        this.tick++;
    };
    Textures.prototype.Release = function () {
        this.tick--;
    };
    Textures.prototype.Dispose = function () {
        if (!this.disposed) {
            this.disposed = true;
            this.texture.disposeBitmapData = true;
            this.texture.dispose();
        }
    };
    Textures.GetTextures = function (texture, path) {
        if (path === void 0) { path = ""; }
        var hash = texture.hashCode.toString();
        if (path.IsFull()) {
            if (Textures.textures == null) {
                Textures.textures = new Listx();
                NForm.SetInterval(60 * 1000, function () {
                    Textures.GC();
                });
            }
            if (!Textures.textures.Exists(path)) {
                Textures.textures[path] = new Listx();
            }
            var arr = Textures.textures[path];
            arr["gc"] = 0;
            if (arr.Exists(hash)) {
                return arr[hash];
            }
            var t = new Textures(texture, path);
            arr[hash] = t;
            return t;
        }
        else {
            if (Textures.texturesStatic.Exists(hash)) {
                return Textures.texturesStatic[hash];
            }
            var t = new Textures(texture, path);
            Textures.texturesStatic[hash] = t;
            return t;
        }
    };
    Textures.GC = function () {
        var gced = false;
        try {
            if (Textures.textures) {
                Textures.textures.EachKey(function (path) {
                    if (Src.inreadingDataCacheList.Exists(path)) {
                        return;
                    }
                    var list = Textures.textures[path];
                    var nouse = true;
                    list.EachKey(function (hash) {
                        if (hash == "gc") {
                        }
                        else {
                            if (list[hash].tick > 0) {
                                nouse = false;
                                return true;
                            }
                        }
                    });
                    if (nouse) {
                        list["gc"]++;
                    }
                    if (list["gc"] >= 2) {
                        Textures.DoGC(path);
                        gced = true;
                    }
                });
            }
            if (gced) {
                Msg.Call("GC", null);
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
    };
    Textures.DoGC = function (path) {
        if (Src.inreadingDataCacheList.Exists(path)) {
            return;
        }
        Js.Trace("GC:" + path);
        var list = Textures.textures[path];
        list.EachKey(function (hash) {
            if (hash == "gc") {
            }
            else {
                var textures = list[hash];
                textures.Dispose();
            }
        });
        list.Clear();
        Textures.textures.Remove(path);
        Src.dataCacheList.Remove(path);
    };
    Textures.texturesStatic = new Listx();
    Textures.textures = null;
    return Textures;
}());
__reflect(Textures.prototype, "Textures");
window["Textures"] = Textures;
var Time = (function () {
    function Time() {
    }
    Time.ParseTime = function (val) {
        var vals = val.split(" ");
        var dates = vals[0].split("-");
        var times = vals[1].split(":");
        return new Date(dates[0].ToInt(), (dates[1].ToInt() - 1), dates[2].ToInt(), times[0].ToInt(), times[1].ToInt(), times[2].ToInt());
    };
    Time.ParseString = function (val) {
        return val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate() + " " + val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds();
    };
    Time.ParseStringWithMilliseconds = function (val) {
        return val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate() + " " + val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds() + "." + val.getMilliseconds();
    };
    Time.GetTimeSpan = function (seconds) {
        var day = Math.floor(seconds / (3600 * 24));
        seconds = seconds - 3600 * 24 * day;
        var hour = Math.floor(seconds / 3600);
        seconds = seconds - 3600 * hour;
        var minute = Math.floor(seconds / 60);
        seconds = seconds - minute * 60;
        if (day == 0) {
            return Strx.PaddingLeft(hour.toString(), 2, "0") + ":" + Strx.PaddingLeft(minute.toString(), 2, "0") + ":" + Strx.PaddingLeft(seconds.toString(), 2, "0");
        }
        else {
            if (Lang.type == LangType.Chs || Lang.type == LangType.Cht) {
                return day + "." + Strx.PaddingLeft(hour.toString(), 2, "0") + ":" + Strx.PaddingLeft(minute.toString(), 2, "0") + ":" + Strx.PaddingLeft(seconds.toString(), 2, "0");
            }
            else {
                return day + "d" + Strx.PaddingLeft(hour.toString(), 2, "0") + ":" + Strx.PaddingLeft(minute.toString(), 2, "0") + ":" + Strx.PaddingLeft(seconds.toString(), 2, "0");
            }
        }
    };
    Object.defineProperty(Time, "Now", {
        get: function () {
            return new DateTime(new Date());
        },
        enumerable: true,
        configurable: true
    });
    return Time;
}());
__reflect(Time.prototype, "Time");
window["Time"] = Time;
var TimeSpan = (function () {
    function TimeSpan(tick) {
        this.tick = tick;
        // var day: number = Math.floor(this.TotalMinutes / (3600 * 24));
        // var seconds = seconds - 3600 * 24 * day;
        // var hour: number = Math.floor(seconds / 3600);
        // seconds = seconds - 3600 * hour;
        // var minute: number = Math.floor(seconds / 60);
        // seconds = seconds - minute * 60;
    }
    Object.defineProperty(TimeSpan.prototype, "TotalDay", {
        get: function () {
            return this.tick / (1000 * 60 * 60 * 24);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "TotalHour", {
        get: function () {
            return this.tick / (1000 * 60 * 60);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "TotalMinutes", {
        get: function () {
            return this.tick / (1000 * 60);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "TotalSeconds", {
        get: function () {
            return this.tick / 1000;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "TotalMilliseconds", {
        get: function () {
            return this.tick;
        },
        enumerable: true,
        configurable: true
    });
    return TimeSpan;
}());
__reflect(TimeSpan.prototype, "TimeSpan");
window["TimeSpan"] = TimeSpan;
var UTF8 = (function () {
    function UTF8() {
        this.EOF_byte = -1;
        this.EOF_code_point = -1;
    }
    UTF8.encode = function (str) {
        return new UTF8().encode(str);
    };
    UTF8.decode = function (data) {
        return new UTF8().decode(data);
    };
    UTF8.prototype.encoderError = function (code_point) {
        console.error("UTF8 encoderError", code_point);
    };
    UTF8.prototype.decoderError = function (fatal, opt_code_point) {
        if (fatal) {
            console.error("UTF8 decoderError", opt_code_point);
        }
        return opt_code_point || 0xFFFD;
    };
    UTF8.prototype.inRange = function (a, min, max) {
        return min <= a && a <= max;
    };
    UTF8.prototype.div = function (n, d) {
        return Math.floor(n / d);
    };
    UTF8.prototype.stringToCodePoints = function (string) {
        /** @type {Array.<number>} */
        var cps = [];
        // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
        var i = 0, n = string.length;
        while (i < string.length) {
            var c = string.charCodeAt(i);
            if (!this.inRange(c, 0xD800, 0xDFFF)) {
                cps.push(c);
            }
            else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                cps.push(0xFFFD);
            }
            else {
                if (i == n - 1) {
                    cps.push(0xFFFD);
                }
                else {
                    var d = string.charCodeAt(i + 1);
                    if (this.inRange(d, 0xDC00, 0xDFFF)) {
                        var a = c & 0x3FF;
                        var b = d & 0x3FF;
                        i += 1;
                        cps.push(0x10000 + (a << 10) + b);
                    }
                    else {
                        cps.push(0xFFFD);
                    }
                }
            }
            i += 1;
        }
        return cps;
    };
    UTF8.prototype.encode = function (str) {
        var pos = 0;
        var codePoints = this.stringToCodePoints(str);
        var outputBytes = [];
        while (codePoints.length > pos) {
            var code_point = codePoints[pos++];
            if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                this.encoderError(code_point);
            }
            else if (this.inRange(code_point, 0x0000, 0x007f)) {
                outputBytes.push(code_point);
            }
            else {
                var count = 0, offset = 0;
                if (this.inRange(code_point, 0x0080, 0x07FF)) {
                    count = 1;
                    offset = 0xC0;
                }
                else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                    count = 2;
                    offset = 0xE0;
                }
                else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                    count = 3;
                    offset = 0xF0;
                }
                outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                while (count > 0) {
                    var temp = this.div(code_point, Math.pow(64, count - 1));
                    outputBytes.push(0x80 + (temp % 64));
                    count -= 1;
                }
            }
        }
        return new Uint8Array(outputBytes);
    };
    UTF8.prototype.decode = function (data) {
        var fatal = false;
        var pos = 0;
        var result = "";
        var code_point;
        var utf8_code_point = 0;
        var utf8_bytes_needed = 0;
        var utf8_bytes_seen = 0;
        var utf8_lower_boundary = 0;
        while (data.length > pos) {
            var _byte = data[pos++];
            if (_byte == this.EOF_byte) {
                if (utf8_bytes_needed != 0) {
                    code_point = this.decoderError(fatal);
                }
                else {
                    code_point = this.EOF_code_point;
                }
            }
            else {
                if (utf8_bytes_needed == 0) {
                    if (this.inRange(_byte, 0x00, 0x7F)) {
                        code_point = _byte;
                    }
                    else {
                        if (this.inRange(_byte, 0xC2, 0xDF)) {
                            utf8_bytes_needed = 1;
                            utf8_lower_boundary = 0x80;
                            utf8_code_point = _byte - 0xC0;
                        }
                        else if (this.inRange(_byte, 0xE0, 0xEF)) {
                            utf8_bytes_needed = 2;
                            utf8_lower_boundary = 0x800;
                            utf8_code_point = _byte - 0xE0;
                        }
                        else if (this.inRange(_byte, 0xF0, 0xF4)) {
                            utf8_bytes_needed = 3;
                            utf8_lower_boundary = 0x10000;
                            utf8_code_point = _byte - 0xF0;
                        }
                        else {
                            this.decoderError(fatal);
                        }
                        utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                        code_point = null;
                    }
                }
                else if (!this.inRange(_byte, 0x80, 0xBF)) {
                    utf8_code_point = 0;
                    utf8_bytes_needed = 0;
                    utf8_bytes_seen = 0;
                    utf8_lower_boundary = 0;
                    pos--;
                    code_point = this.decoderError(fatal, _byte);
                }
                else {
                    utf8_bytes_seen += 1;
                    utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                    if (utf8_bytes_seen !== utf8_bytes_needed) {
                        code_point = null;
                    }
                    else {
                        var cp = utf8_code_point;
                        var lower_boundary = utf8_lower_boundary;
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                            code_point = cp;
                        }
                        else {
                            code_point = this.decoderError(fatal, _byte);
                        }
                    }
                }
            }
            //Decode string
            if (code_point !== null && code_point !== this.EOF_code_point) {
                if (code_point <= 0xFFFF) {
                    if (code_point > 0)
                        result += String.fromCharCode(code_point);
                }
                else {
                    code_point -= 0x10000;
                    result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                    result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                }
            }
        }
        return result;
    };
    return UTF8;
}());
__reflect(UTF8.prototype, "UTF8");
window["UTF8"] = UTF8;
var Caches = (function () {
    function Caches() {
    }
    Caches.GetDic = function (key) {
        if (!Caches.dic[key]) {
            Caches.dic[key] = new Listx();
        }
        return Caches.dic[key];
    };
    Caches.GetListx = function (key) {
        if (!Caches.dic[key]) {
            Caches.dic[key] = new Listx();
        }
        return Caches.dic[key];
    };
    Caches.GetArr = function (key) {
        if (!Caches.dic[key]) {
            Caches.dic[key] = [];
        }
        return Caches.dic[key];
    };
    Caches.GetObj = function (key) {
        return Caches.dic[key];
    };
    Caches.SetObj = function (key, obj) {
        Caches.dic[key] = obj;
    };
    Caches.dic = new Listx();
    return Caches;
}());
__reflect(Caches.prototype, "Caches");
window["Caches"] = Caches;
var Vector2Hash = (function () {
    function Vector2Hash(width, height, data) {
        if (data === void 0) { data = ""; }
        this.width = width;
        this.height = height;
        this.v = [];
        for (var i = 0; i < height; i++) {
            var v1 = [];
            this.v[i] = v1;
        }
        var len = data.length;
        for (i = 0; i < len; i++) {
            var d = data.charAt(i);
            if (d.ToInt()) {
                this.Set(i % width, i / width);
            }
        }
    }
    Vector2Hash.prototype.Set = function (x, y) {
        this.v[y][x] = 1;
    };
    Vector2Hash.prototype.Delete = function (x, y) {
        this.v[y][x] = 0;
    };
    Vector2Hash.prototype.Exists = function (x, y) {
        return this.v[y][x];
    };
    Vector2Hash.prototype.ExistsPoint = function (p) {
        return this.v[p.y][p.x];
    };
    Vector2Hash.prototype.Clear = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.v[i][j] = 0;
            }
        }
    };
    Object.defineProperty(Vector2Hash.prototype, "length", {
        get: function () {
            return this.height;
        },
        enumerable: true,
        configurable: true
    });
    return Vector2Hash;
}());
__reflect(Vector2Hash.prototype, "Vector2Hash");
window["Vector2Hash"] = Vector2Hash;
var Xml = (function () {
    function Xml(text) {
        this.nodes = [];
        this.keys = {};
        if (text == null || text.IsEmpty()) {
            return;
        }
        var types = { beginNode: 1, endNode: 2, text: 3, att: 4 };
        var xml = this.nodes;
        var keys = this.keys;
        var parent = null;
        var obj;
        var nodeName;
        var readerNode = function (node) {
            if (node.type == types.beginNode) {
                nodeName = node.val.join("");
                if (nodeName == "root" || nodeName == "TextureAtlas") {
                }
                else if (nodeName == "ox" || nodeName == "SubTexture") {
                    obj = {};
                    xml.push(obj);
                    parent = null;
                }
                else if (nodeName == "oxs") {
                    if (!parent) {
                        parent = obj;
                    }
                    if (!parent[nodeName]) {
                        parent[nodeName] = [];
                    }
                    var obj1 = {};
                    parent[nodeName].push(obj1);
                    obj = obj1;
                }
                else {
                }
            }
            else if (node.type == types.endNode) {
            }
            else if (node.type == types.text) {
                if (obj) {
                    if (nodeName) {
                        obj[nodeName] = node.val.join("").replace(/&amp;/g, "&")
                            .replace(/&amp;/g, "&")
                            .replace(/&lt;/g, "<")
                            .replace(/&gt;/g, ">")
                            .replace(/&quot;/g, "\"")
                            .replace(/&apos;/g, "\'");
                        if (!keys[nodeName]) {
                            keys[nodeName] = true;
                        }
                    }
                }
            }
            else if (node.type == types.att) {
                if (obj) {
                    var nodeName_1 = node.node.join("");
                    obj[nodeName_1] = node.val.join("");
                    if (!keys[nodeName_1]) {
                        keys[nodeName_1] = true;
                    }
                }
            }
        };
        var begin = false;
        var end = false;
        var node = [];
        var textVal = [];
        var beginIndex = 0;
        var isAtt = false;
        var beginAtt = 0;
        for (var i = 0, len = text.length; i < len; i++) {
            var c = text.charAt(i);
            if (!begin) {
                if (isAtt) {
                    if (beginAtt >= 2) {
                        if (c == "\"") {
                            beginAtt = 0;
                            readerNode({ type: types.att, node: node, val: textVal });
                            textVal.length = 0;
                            node.length = 0;
                        }
                        else {
                            textVal.push(c);
                        }
                    }
                    else if (c == "=" || c == "\"") {
                        beginAtt++;
                    }
                    else if (c == ">") {
                        isAtt = false;
                        beginAtt = 0;
                        textVal.length = 0;
                        node.length = 0;
                    }
                    else {
                        if (c != " ") {
                            node.push(c);
                        }
                    }
                }
                else {
                    if (c == "<") {
                        begin = true;
                        node.length = 0;
                        if (beginIndex == 3) {
                            readerNode({ type: types.text, val: textVal });
                            textVal.length = 0;
                        }
                        beginIndex++;
                    }
                    else {
                        textVal.push(c);
                    }
                }
            }
            else {
                if (c == "/") {
                    end = true;
                    beginIndex -= 2;
                }
                else if (c == ">") {
                    if (end) {
                        readerNode({ type: types.endNode, val: node });
                    }
                    else {
                        readerNode({ type: types.beginNode, val: node });
                    }
                    begin = false;
                    end = false;
                    textVal.length = 0;
                    isAtt = false;
                    node.length = 0;
                    ;
                }
                else if (node && c == " ") {
                    readerNode({ type: types.beginNode, val: node });
                    begin = false;
                    end = false;
                    textVal.length = 0;
                    isAtt = true;
                    node.length = 0;
                    ;
                }
                else {
                    node.push(c);
                }
            }
        }
    }
    return Xml;
}());
__reflect(Xml.prototype, "Xml");
window["Xml"] = Xml;
var XmlLinqT = (function (_super) {
    __extends(XmlLinqT, _super);
    function XmlLinqT() {
        var _this = _super.call(this) || this;
        _this._staticData = false;
        _this._names = new Arr();
        _this.changedFuncList.Add(_this.DoChanged.bind(_this));
        return _this;
    }
    XmlLinqT.prototype.DoChanged = function (key, oldList, list) {
        if (typeof key == "undefined") {
            //throw new Error("key undefined");
            return;
        }
        // if (list._parent == this) {
        //     return;
        // }
        this._names.Remove(key);
        //if (this._sortKey == null || typeof this._sortKey == "string" && Strx.IsEmpty(this._sortKey)) {
        this._names.Add(key);
        // }
        // else {
        //     let isString = typeof this._sortKey == "string";
        //     let val: string = null;
        //     if (isString) {
        //         val = list.g(this._sortKey);
        //     }
        //     else if (this._sortKey instanceof Function) {
        //         val = this._sortKey(list);
        //     }
        //     let doIt: boolean = true;
        //     if (val) {
        //         let index: number = 0;
        //         this.Each((fi: Listx): boolean => {
        //             let val1: string;
        //             if (isString) {
        //                 val1 = fi.g(this._sortKey);
        //             }
        //             else if (this._sortKey instanceof Function) {
        //                 val1 = this._sortKey(fi);
        //             }
        //             let bigger: boolean = false;
        //             if (Number(val).toString() == val && Number(val1).toString() == val1) {
        //                 if (Number(val) >= Number(val1)) {
        //                     bigger = true;
        //                 }
        //                 else {
        //                     bigger = false;
        //                 }
        //             }
        //             else {
        //                 if (val.charCodeAt(0) >= val1.charCodeAt(0)) {
        //                     bigger = true;
        //                 }
        //                 else {
        //                     bigger = false;
        //                 }
        //             }
        //             if (bigger && this._sortDesc || !bigger && !this._sortDesc) {
        //                 this._names.InsertAt(key, index);
        //                 doIt = false;
        //                 return true;
        //             }
        //             index++;
        //         });
        //     }
        //     if (doIt) {
        //         this._names.Add(key);
        //     }
        // }
        if (this.OnListAddList) {
            this.OnListAddList.Each(function (fi) {
                fi(list);
            });
        }
        list.changedFuncList.Add(this.ItemDoChanged.bind(this));
        list._parent = this;
    };
    XmlLinqT.prototype.ItemDoChanged = function (key, oldValue, newValue, item) {
        if (this.OnChangedList) {
            for (var fi_key_a in this.OnChangedList.source) {
                if (fi_key_a != "Each") {
                    var fi = this.OnChangedList.source[fi_key_a];
                    fi(key, oldValue, newValue, item);
                }
            }
        }
    };
    XmlLinqT.prototype.Remove = function (name) {
        var _this = this;
        if (this.Exists(name)) {
            if (this.OnRemoveList) {
                this.OnRemoveList.EachDesc((function (fi) {
                    try {
                        if (fi) {
                            fi(name, _this[name]);
                        }
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                }).bind(this));
            }
            try {
                this._names.Remove(name); //TODO:这句话在重连的时候有问题？
                this[name].changedFuncList.Remove(this.ItemDoChanged);
                _super.prototype.Remove.call(this, name);
            }
            catch (ex) {
                Js.Trace(ex);
            }
        }
    };
    XmlLinqT.prototype.GetName = function (index) {
        if (this._names.length > index) {
            return this._names.getItemAt(index);
        }
        return "";
    };
    XmlLinqT.prototype.GetValue = function (index) {
        var name = this.GetName(index);
        if (Strx.IsFull(name)) {
            return this.g(name);
        }
        return null;
    };
    XmlLinqT.prototype.Exists = function (name) {
        return _super.prototype.Exists.call(this, name);
    };
    Object.defineProperty(XmlLinqT.prototype, "Length", {
        get: function () {
            return this._names.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XmlLinqT.prototype, "length", {
        get: function () {
            return this._names.length;
        },
        enumerable: true,
        configurable: true
    });
    XmlLinqT.prototype.OnAdd = function (act, sx) {
        var _this = this;
        if (this.OnListAddList == null) {
            this.OnListAddList = new Arr();
        }
        this.OnListAddList.Add(act);
        sx.OnDispose(function () {
            if (_this.OnListAddList) {
                _this.OnListAddList.Remove(act);
            }
        });
    };
    XmlLinqT.prototype.OnRemove = function (act, sx) {
        var _this = this;
        if (this.OnRemoveList == null) {
            this.OnRemoveList = new Arr();
        }
        this.OnRemoveList.Add(act);
        sx.OnDispose(function () {
            if (_this.OnRemoveList) {
                _this.OnRemoveList.Remove(act);
            }
        });
    };
    XmlLinqT.prototype.OnChanged = function (act, sx) {
        var _this = this;
        if (this.OnChangedList == null) {
            // this.Each((fi: Listx) => {
            //     fi.changedFuncList.Add(that.ItemDoChanged.bind(this));
            // });
            this.OnChangedList = new Arr();
        }
        this.OnChangedList.Add(act);
        sx.OnDispose(function () {
            if (_this.OnChangedList) {
                _this.OnChangedList.Remove(act);
            }
        });
    };
    XmlLinqT.prototype.OnAddSplice = function (act) {
        if (this.OnListAddList) {
            this.OnListAddList.Remove(act);
        }
    };
    XmlLinqT.prototype.OnRemoveSplice = function (act) {
        if (this.OnRemoveList) {
            this.OnRemoveList.Remove(act);
        }
    };
    XmlLinqT.prototype.OnChangedSplice = function (act) {
        if (this.OnChangedList) {
            this.OnChangedList.Remove(act);
        }
    };
    XmlLinqT.prototype.ListenEmpty = function (act, id, key, sx1) {
        var _this = this;
        if (this._staticData) {
            throw new Error("Static Data Can Not be Binded");
        }
        var item;
        //let sx: Sx;
        if (this.Exists(id)) {
            item = (this.g(id));
            //sx = new Sx();
            //sx.autoDispose = false;
            item.Listen(function () {
                //act(item.g(key));
                act(item[key]);
            }, key, sx1);
        }
        else {
            act("");
        }
        var act1 = function (item1) {
            var id1 = item1["id"];
            if (id == id1) {
                // if (sx) {
                //     sx.Dispose();
                // }
                item = item1;
                //sx = new Sx();
                //sx.autoDispose = false;
                item.Listen(function () {
                    //act(item.g(key));
                    act(item[key]);
                }, key, sx1);
            }
        };
        this.OnAdd(act1, sx1);
        var act2 = function (id1) {
            if (id == id1) {
                // if (sx) {
                //     sx.Dispose();
                // }
                act("");
            }
        };
        this.OnRemove(act2, sx1);
        var act3 = function () {
            // if (sx) {
            //     sx.Dispose();
            //     sx = null;
            // }
            _this.OnAddSplice(act1);
            _this.OnRemoveSplice(act2);
            act1 = null;
            act2 = null;
            act3 = null;
        };
        sx1.OnDispose(act3);
    };
    XmlLinqT.prototype.GetPageSize = function (pageSize) {
        var rv = Math.ceil(this.Length / pageSize);
        if (rv <= 0) {
            rv = 1;
        }
        return rv;
    };
    XmlLinqT.prototype.GetPage = function (pageSize, page) {
        var xqt = new XmlLinqT();
        for (var i = pageSize * page, len = pageSize * page + pageSize; i < len; i++) {
            try {
                var name_1 = this.GetName(i);
                if (Strx.IsFull(name_1)) {
                    var item = this.g(name_1);
                    if (item) {
                        xqt.Add(item);
                    }
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
        }
        return xqt;
    };
    // public Each(func: Function): void {
    //     this._names.Each(((name) => {
    //         try {
    //             let val: Listx = this.g(name);
    //             if (func(val)) {
    //                 return true;
    //             }
    //         } catch (ex) {
    //             Js.Trace(ex);
    //         }
    //         return false;
    //     }).bind(this));
    // }
    XmlLinqT.prototype.Each = function (func) {
        var _this = this;
        this.EachKey(function (name) {
            try {
                //Js.Trace(name);
                var val = _this.g(name);
                if (func(val)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
        });
    };
    XmlLinqT.prototype.Take = function (size, skip) {
        if (skip === void 0) { skip = 0; }
        var xqt = new XmlLinqT();
        var index = 0;
        this.Each(function (item) {
            try {
                if (index >= skip && index < skip + size) {
                    xqt.Add(item);
                }
                if (index >= skip + size) {
                    return true;
                }
                index++;
            }
            catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return xqt;
    };
    XmlLinqT.prototype.s = function (key, val) {
        throw new Error("XmlLinqT: please use Add instead.");
        //Js.Trace("XmlLinqT: please use Add instead.");
        //this.Add(val);
    };
    XmlLinqT.prototype.Where = function (func) {
        var xqt = new XmlLinqT();
        this.Each(function (item) {
            try {
                if (func(item)) {
                    xqt.Add(item);
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return xqt;
    };
    XmlLinqT.prototype.Reverse = function () {
        var xqt = new XmlLinqT();
        var list = this.ToArray();
        list.reverse().forEach((function (fi) {
            if (fi) {
                xqt.Add(fi);
            }
        }).bind(this));
        return xqt;
    };
    XmlLinqT.prototype.Copy = function () {
        var xqt = new XmlLinqT();
        this.Each(function (item) {
            try {
                xqt.Add(item);
            }
            catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return xqt;
    };
    XmlLinqT.prototype.Count = function (func) {
        var rv = 0;
        this.Each(function (item) {
            if (func(item)) {
                rv++;
            }
            return false;
        });
        return rv;
    };
    XmlLinqT.prototype.All = function (func) {
        var rv = true;
        this.Each(function (item) {
            try {
                if (!func(item)) {
                    rv = false;
                    return true;
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    };
    XmlLinqT.prototype.Any = function (func) {
        var rv = false;
        this.Each(function (item) {
            try {
                if (func(item)) {
                    rv = true;
                    return true;
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    };
    XmlLinqT.prototype.FirstOrDefault = function (func) {
        var rv;
        this.Each(function (item) {
            try {
                if (func(item)) {
                    rv = item;
                    return true;
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    };
    XmlLinqT.prototype.Max = function (func) {
        //let rv = Number.MIN_VALUE;
        var rv = -Number.MAX_VALUE;
        this.Each(function (item) {
            try {
                rv = Math.max(rv, func(item));
                return false;
            }
            catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    };
    XmlLinqT.prototype.Min = function (func) {
        var rv = Number.MAX_VALUE;
        this.Each(function (item) {
            try {
                rv = Math.min(rv, func(item));
                return false;
            }
            catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    };
    XmlLinqT.prototype.MaxItem = function (func) {
        if (this.Length == 0) {
            return null;
        }
        var maxVal = this.Max(func);
        return this.FirstOrDefault(function (item) {
            try {
                return func(item) == maxVal;
            }
            catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
    };
    XmlLinqT.prototype.Sum = function (func) {
        var rv = 0;
        this.Each(function (item) {
            try {
                rv += func(item);
                return false;
            }
            catch (ex) {
                Js.Trace(ex);
            }
            return false;
        });
        return rv;
    };
    XmlLinqT.prototype.Select = function (func) {
        var list = [];
        this.Each(function (item) {
            try {
                list.push(func(item));
            }
            catch (ex) {
                Js.Trace(ex);
            }
        });
        return list;
    };
    XmlLinqT.prototype.ToArray = function () {
        return this.Select(function (fi) {
            try {
                return fi;
            }
            catch (ex) {
                Js.Trace(ex);
            }
        });
    };
    XmlLinqT.prototype.RemoveAll = function (func) {
        var xqt = new XmlLinqT();
        this.Each(function (xi) {
            if (!func(xi)) {
                xqt.Add(xi);
            }
        });
        return xqt;
    };
    XmlLinqT.prototype.OrderBy = function (key) {
        if (key == null) {
            return this;
        }
        var xqt = new XmlLinqT();
        if (key instanceof Function) {
            var list = this.ToArray().sort(function (a, b) {
                try {
                    return key(a) - key(b);
                }
                catch (ex) {
                    Js.Trace(ex);
                }
                return 0;
            });
            list.forEach(function (fi) {
                xqt.Add(fi);
            });
        }
        else {
            var list = this.ToArray().sort(function (a, b) {
                try {
                    return a[key].ToInt() - b[key].ToInt();
                }
                catch (ex) {
                    Js.Trace(ex);
                }
                return 0;
            });
            list.forEach(function (fi) {
                xqt.Add(fi);
            });
        }
        // if (key instanceof Function) {
        //     this.Each( (item: Listx)=> {
        //         try {
        //             xqt.Add(item);
        //             return false;
        //         } catch (ex) {
        //             Js.Trace(ex);
        //         }
        //         return false;
        //     });
        // } else {
        //     this.Each( (item: Listx)=> {
        //         try {
        //             xqt.Add(item);
        //             return false;
        //         } catch (ex) {
        //             Js.Trace(ex);
        //         }
        //         return false;
        //     });
        // }
        return xqt;
    };
    XmlLinqT.prototype.GroupBy = function (func) {
        var list = new Listx();
        this.Each(function (item) {
            var key = func(item);
            if (!list.Exists(key)) {
                list[key] = new XmlLinqT();
            }
            list[key].Add(item);
        });
        return list;
    };
    XmlLinqT.prototype.Add = function (item, keys) {
        if (keys === void 0) { keys = null; }
        item.CreateGSS(keys);
        var key = item["id"];
        _super.prototype.s.call(this, key, item);
    };
    XmlLinqT.prototype.AddKey = function (key, item) {
        _super.prototype.s.call(this, key, item);
    };
    XmlLinqT.prototype.Text = function () {
        return Listx.GetArrText(this.ToArray());
    };
    //这里的无法正确清除，使用base.Clear();
    XmlLinqT.prototype.Clear = function () {
        var _this = this;
        _super.prototype.Clear.call(this);
        this._names.Each(function (fi) {
            delete _this[fi];
            delete _this["_" + fi];
        });
        this._names.Clear();
        this.ResetLength();
    };
    XmlLinqT.prototype.Dispose = function () {
        if (this.OnListAddList) {
            this.OnListAddList.Clear();
            this.OnListAddList = null;
        }
        if (this.OnRemoveList) {
            this.OnRemoveList.Clear();
            this.OnRemoveList = null;
        }
        if (this.OnChangedList) {
            this.OnChangedList.Clear();
            this.OnChangedList = null;
        }
        for (var fi in this) {
            delete this[fi];
        }
        _super.prototype.Dispose.call(this);
    };
    return XmlLinqT;
}(Observer));
__reflect(XmlLinqT.prototype, "XmlLinqT");
window["XmlLinqT"] = XmlLinqT;
var Assert = (function () {
    function Assert() {
    }
    Assert.Load = function (process, loaded) {
        if (Assert.finished) {
            loaded();
            return;
        }
        Assert.process = process;
        Assert.loaded = loaded;
        var preload = RES["config"]["config"]["groups"]["preload"];
        preload.forEach(function (fi) {
            var fis = fi.split("_");
            if (fis.length > 1) {
                if (fis[1] == "png" || fis[1] == "jpg") {
                    Assert.assertList[fi] = RES.getRes(fi);
                }
                else if (fis[1] == "xml") {
                    Assert.classes.Add(fis[0]);
                }
            }
        });
        Assert.Next();
    };
    Assert.Next = function () {
        Assert.index++;
        if (Assert.classes.length > Assert.index) {
            var atlasName = Assert.classes.getItemAt(Assert.index);
            //NForm.SetTimeout(100, () => {
            Assert.Process(atlasName, Assert.Next);
            //});
        }
        else {
            if (Assert.loaded) {
                Assert.loaded();
                Assert.loaded = null;
            }
            Assert.process = null;
            Assert.classes.Clear();
            Assert.classes = null;
            Assert.index = -1;
            Assert.Next1();
        }
    };
    Assert.Next1 = function () {
        Assert.index++;
        if (Assert.classes1 && Assert.classes1.Length > Assert.index) {
            var atlasName = Assert.classes1.getItemAt(Assert.index);
            NForm.SetTimeout(100, function () {
                Assert.Process(atlasName, Assert.Next1);
            });
            //////////
        }
        else {
            if (Assert.loaded) {
                Assert.loaded();
                Assert.loaded = null;
            }
            Assert.process = null;
            Assert.classes1.Clear();
            Assert.classes1 = null;
            Assert.finished = true;
        }
    };
    Assert.Process = function (atlasName, nextFunc) {
        Assert.processAtlasName = atlasName;
        if (Assert.process) {
            Assert.process(atlasName, 0, 1);
        }
        Js.Trace("Load Atlas:" + atlasName);
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        var textures = RES.getRes(atlasName + "_png");
        //Js.Trace(textures);
        var data = RES.getRes(atlasName + "_xml");
        //data = data.replace(/TextureAtlas/g, "root");
        //data = data.replace(/SubTexture/g, "ox");
        var xml = new Xml(data);
        xml.nodes.forEach(function (fi) {
            ////////////////////////////////////
            var t = new egret.Texture();
            t.$bitmapData = textures.$bitmapData;
            //if (fullImg) {
            if (typeof fi.frameX == "undefined") {
                fi.frameX = 0;
            }
            if (typeof fi.frameY == "undefined") {
                fi.frameY = 0;
            }
            if (fi.sourceWidth) {
                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.sourceWidth, fi.sourceHeight, textures.textureWidth, textures.textureHeight, fi.rotated);
            }
            else if (fi.frameWidth) {
                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.frameWidth, fi.frameHeight, textures.textureWidth, textures.textureHeight, fi.rotated);
            }
            else {
                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.width, fi.height, textures.textureWidth, textures.textureHeight, fi.rotated);
            }
            // } else {
            //     t.$initData(fi.x, fi.y, fi.width, fi.height, 0, 0, fi.width, fi.height, textures.textureWidth, textures.textureHeight, fi.rotated);
            // }
            var texture = t;
            if (Assert.assertList.Exists(fi.name)) {
                Js.Trace("Exists Texture:" + fi.name);
            }
            if (fi.name.indexOf("_") > -1) {
                Assert.aniAssertList[fi.name] = texture;
            }
            Assert.assertList[fi.name] = texture;
        });
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        if (nextFunc) {
            nextFunc();
        }
    };
    Assert.Img = function (name) {
        if (name.indexOf(".") > -1) {
            if (name.StartWith("http")) {
                var bx_1 = new NSprite(name, -1, -1);
                return bx_1;
            }
            else if (name.indexOf("/") == -1) {
                var bx_2 = new NSprite(Config.src + "ui/" + name, -1, -1);
                return bx_2;
            }
            else {
                if (name.indexOf("lang") > -1) {
                    var bx_3 = new NSprite(Config.src + name.replace("lang", "lang/" + Lang.type), -1, -1);
                    return bx_3;
                }
                else {
                    var bx = new NSprite(Config.src + name, -1, -1);
                    return bx;
                }
            }
        }
        else {
            if (name.indexOf("/") > -1) {
                var bx = new Sp(name.split("/")[1]);
                return bx;
            }
            else {
                var bx = new Sp(name);
                // if (loaded) {
                //     Form.LazyCall(() => {
                //         loaded();
                //     });
                // }
                return bx;
            }
        }
    };
    Assert.Trace = function () {
        if (Assert.process) {
        }
    };
    Assert.assertList = new Listx();
    Assert.aniAssertList = new Listx();
    Assert.classes = new Arr();
    Assert.classes1 = new Arr();
    Assert.finished = false;
    Assert.index = -1;
    Assert.processAtlasName = "";
    return Assert;
}());
__reflect(Assert.prototype, "Assert");
window["Assert"] = Assert;
// class Caches extends egret.HashObject {
//     public static dic: Dictionary = new Dictionary();
//     public static GetDic(key: string): any {
//         if(!Caches.dic.Get(key)) {
//             Caches.dic.Set(key,new Dictionary());
//         }
//         return Caches.dic.Get(key);
//     }
//     public static GetListx(key: string): Listx {
//         if(!Caches.dic.Get(key)) {
//             Caches.dic.Set(key,new Listx());
//         }
//         return Caches.dic.Get(key);
//     }
//     public static GetArr(key: string): any {
//         if(!Caches.dic.Get(key)) {
//             Caches.dic.Set(key,[]);
//         }
//         return Caches.dic.Get(key);
//     }
//     public static GetObj(key: string): any {
//         return Caches.dic.Get(key);
//     }
//     public static SetObj(key: string,obj: any) {
//         Caches.dic.Set(key,obj);
//     }
// }
///<reference path="LangType.ts" />
if (!String.prototype.format) {
    String.prototype.format = function (arr) {
        var args = arr;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match;
        });
    };
}
var Lang = (function () {
    function Lang() {
    }
    Lang.Setup = function (att) {
        Lang.list = att;
    };
    // public static get Get(): any {
    //     return Lang.list;
    // }
    Lang.Get = function (key) {
        if (!Lang.list) {
            return "";
        }
        if (Lang.list.hasOwnProperty(key)) {
            var text = Lang.list[key];
            if (text.indexOf("&lt;") > -1 && text.indexOf("&gt;") > -1) {
                text = text.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            }
            if (text.indexOf(" ") > -1) {
                text = text.replace(/ /g, " ");
            }
            return text;
        }
        return "";
    };
    Lang.Exists = function (key) {
        return Lang.list.hasOwnProperty(key);
    };
    Lang.PT = function (val) {
        if (val == null) {
            val = "";
        }
        try {
            var vals = val.split("|");
            if (vals.length == 1) {
                return Lang.GetLangText(val);
            }
            else {
                var str = Lang.GetLangText(vals[0]);
                vals.shift();
                var text = str.format(vals);
                //                var text: string =mx.utils.StringUtil.substitute.apply(null,vals);
                return text;
                //                return val;
            }
        }
        catch (ex) {
            return val;
        }
    };
    Lang.GetLangText = function (val) {
        if (Strx.IsEmpty(val)) {
            return "";
        }
        if (Lang.Get == null) {
            return val;
        }
        if (Lang.Get(val)) {
            var val1 = Lang.Get(val);
            if (Strx.IsFull(val1)) {
                val = val1;
                if (Js.showTrace) {
                    //                    if(NColorText.willEmbedFontsFunc) {
                    //                        Lang.AddTransList(val);
                    //                        Lang.AddTransList(val + "：");
                    //                        Lang.AddTransList("[" + val + "]");
                    //                    }
                }
            }
        }
        else {
            if (val.indexOf(">") > -1 && val.indexOf("<") > -1) {
                var vals = val.split("<");
                for (var j = 0, lenj = vals.length; j < lenj; j++) {
                    var vals1 = vals[j].split(">");
                    for (var i = 0, len = vals1.length; i < len; i++) {
                        vals1[i] = Lang.GetLangText(vals1[i]);
                    }
                    vals[j] = vals1.join(">");
                }
                val = vals.join("<");
            }
            else {
                if (Js.showTrace) {
                    //                    if(NColorText.willEmbedFontsFunc) {
                    //                        if(val.indexOf("/") == -1) {
                    //                            if(!Lang.transList.Exists(val)) {
                    //                                Lang.AddTransList(val);
                    //                                if(val.length < 15) {
                    //                                    if(val.length != Strx.TrueLength(val))
                    //                                    { }
                    //                                }
                    //                            }
                    //                        }
                    //                    }
                }
            }
        }
        return val;
    };
    Lang.AddTransList = function (val) {
        if (Js.showTrace) {
            Lang.transList[val] = true;
        }
    };
    Lang.type = LangType.Chs;
    return Lang;
}());
__reflect(Lang.prototype, "Lang");
window["Lang"] = Lang;
var Color = (function () {
    function Color(argb) {
        if (argb === void 0) { argb = 0; }
        this.color = 0;
        this.Set(argb);
    }
    Color.prototype.Set = function (color) {
        if (color === void 0) { color = 0; }
        this.color = color;
    };
    Object.defineProperty(Color.prototype, "a", {
        get: function () {
            return this.color >> 24 & 0xff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "r", {
        get: function () {
            return this.color >> 16 & 0xff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "g", {
        get: function () {
            return this.color >> 8 & 0xff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "b", {
        get: function () {
            return this.color & 0xff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "rgb", {
        get: function () {
            return "#" + Strx.PaddingRight(this.r.toString(16), 2, "0") + Strx.PaddingRight(this.g.toString(16), 2, "0") + Strx.PaddingRight(this.b.toString(16), 2, "0");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color, "Green", {
        get: function () {
            return 0x83fb1f;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color, "GreenGame", {
        get: function () {
            return "#83fb1f";
        },
        enumerable: true,
        configurable: true
    });
    Color.Parse = function (color) {
        return new Color(color.replace("#", "0x").ToInt());
    };
    return Color;
}());
__reflect(Color.prototype, "Color");
window["Color"] = Color;
var Parms = (function () {
    function Parms() {
    }
    Parms.phone = false;
    return Parms;
}());
__reflect(Parms.prototype, "Parms");
window["Parms"] = Parms;
var BCenter = (function (_super) {
    __extends(BCenter, _super);
    function BCenter(b, yAlign, xOffset, yOffset) {
        if (yAlign === void 0) { yAlign = 0; }
        if (xOffset === void 0) { xOffset = 0; }
        if (yOffset === void 0) { yOffset = 0; }
        var _this = _super.call(this) || this;
        if (b == null) {
            return _this;
        }
        _this.b = b;
        if (b.OnLoaded && b.width == 0) {
            b.OnLoaded(function () {
                if (!_this.disposed) {
                    b.x = -b.width / 2 + xOffset;
                    if (yAlign == 0) {
                        b.y = -b.height / 2 + yOffset;
                    }
                    else if (yAlign == 1) {
                        b.y = -b.height + yOffset;
                    }
                }
            });
        }
        else {
            b.x = -b.width / 2 + xOffset;
            if (yAlign == 0) {
                b.y = -b.height / 2 + yOffset;
            }
            else if (yAlign == 1) {
                b.y = -b.height + yOffset;
            }
        }
        _this.Add(b);
        return _this;
    }
    Object.defineProperty(BCenter.prototype, "width", {
        get: function () {
            return this.b.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BCenter.prototype, "height", {
        get: function () {
            return this.b.height;
        },
        enumerable: true,
        configurable: true
    });
    return BCenter;
}(Sx));
__reflect(BCenter.prototype, "BCenter");
window["BCenter"] = BCenter;
var N9 = (function (_super) {
    __extends(N9, _super);
    function N9(val, rect) {
        if (rect === void 0) { rect = null; }
        var _this = _super.call(this) || this;
        _this.img = Assert.Img(val);
        _this.img.OnLoaded(function () {
            _this.img.fillMode = egret.BitmapFillMode.SCALE;
            if (rect == null) {
                _this.img.scale9Grid = new Rectangle(_this.img.texture.$bitmapWidth / 2, _this.img.texture.$bitmapHeight / 2, 1, 1);
            }
            else {
                _this.img.scale9Grid = rect;
            }
        });
        _this.Add(_this.img);
        return _this;
    }
    N9.prototype.OnLoaded = function (loaded) {
        this.img.OnLoaded(function () {
            loaded();
        });
    };
    Object.defineProperty(N9.prototype, "width", {
        get: function () {
            return this.img.width;
        },
        set: function (val) {
            this.img.width = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(N9.prototype, "height", {
        get: function () {
            return this.img.height;
        },
        set: function (val) {
            this.img.height = val;
        },
        enumerable: true,
        configurable: true
    });
    return N9;
}(Sx));
__reflect(N9.prototype, "N9");
window["N9"] = N9;
var ColorChange = (function () {
    // initialization:
    function ColorChange(p_matrix) {
        if (p_matrix === void 0) { p_matrix = null; }
        this.data = [];
        //super();
        p_matrix = this.fixMatrix(p_matrix);
        this.copyMatrix(((p_matrix.length == ColorChange.LENGTH) ? p_matrix : ColorChange.IDENTITY_MATRIX));
    }
    // public methods:
    ColorChange.prototype.reset = function () {
        for (var i = 0; i < ColorChange.LENGTH; i++) {
            this.data[i] = ColorChange.IDENTITY_MATRIX[i];
        }
    };
    ColorChange.prototype.adjustColor = function (p_brightness, p_contrast, p_saturation, p_hue) {
        this.adjustHue(p_hue);
        this.adjustContrast(p_contrast);
        this.adjustBrightness(p_brightness);
        this.adjustSaturation(p_saturation);
    };
    ColorChange.prototype.adjustBrightness = function (p_val) {
        p_val = this.cleanValue(p_val, 100);
        if (p_val == 0 || isNaN(p_val)) {
            return;
        }
        this.multiplyMatrix([
            1, 0, 0, 0, p_val,
            0, 1, 0, 0, p_val,
            0, 0, 1, 0, p_val,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    };
    ColorChange.prototype.adjustContrast = function (p_val) {
        p_val = this.cleanValue(p_val, 100);
        if (p_val == 0 || isNaN(p_val)) {
            return;
        }
        var x;
        if (p_val < 0) {
            x = 127 + p_val / 100 * 127;
        }
        else {
            x = p_val % 1;
            if (x == 0) {
                x = ColorChange.DELTA_INDEX[p_val];
            }
            else {
                //x = DELTA_INDEX[(p_val<<0)]; // this is how the IDE does it.
                x = ColorChange.DELTA_INDEX[(p_val << 0)] * (1 - x) + ColorChange.DELTA_INDEX[(p_val << 0) + 1] * x; // use linear interpolation for more granularity.
            }
            x = x * 127 + 127;
        }
        this.multiplyMatrix([
            x / 127, 0, 0, 0, 0.5 * (127 - x),
            0, x / 127, 0, 0, 0.5 * (127 - x),
            0, 0, x / 127, 0, 0.5 * (127 - x),
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    };
    ColorChange.prototype.adjustSaturation = function (p_val) {
        p_val = this.cleanValue(p_val, 100);
        if (p_val == 0 || isNaN(p_val)) {
            return;
        }
        var x = 1 + ((p_val > 0) ? 3 * p_val / 100 : p_val / 100);
        var lumR = 0.3086;
        var lumG = 0.6094;
        var lumB = 0.0820;
        this.multiplyMatrix([
            lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0,
            lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0,
            lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    };
    ColorChange.prototype.adjustHue = function (p_val) {
        p_val = this.cleanValue(p_val, 180) / 180 * Math.PI;
        if (p_val == 0 || isNaN(p_val)) {
            return;
        }
        var cosVal = Math.cos(p_val);
        var sinVal = Math.sin(p_val);
        var lumR = 0.213;
        var lumG = 0.715;
        var lumB = 0.072;
        this.multiplyMatrix([
            lumR + cosVal * (1 - lumR) + sinVal * (-lumR), lumG + cosVal * (-lumG) + sinVal * (-lumG), lumB + cosVal * (-lumB) + sinVal * (1 - lumB), 0, 0,
            lumR + cosVal * (-lumR) + sinVal * (0.143), lumG + cosVal * (1 - lumG) + sinVal * (0.140), lumB + cosVal * (-lumB) + sinVal * (-0.283), 0, 0,
            lumR + cosVal * (-lumR) + sinVal * (-(1 - lumR)), lumG + cosVal * (-lumG) + sinVal * (lumG), lumB + cosVal * (1 - lumB) + sinVal * (lumB), 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    };
    ColorChange.prototype.concat = function (p_matrix) {
        p_matrix = this.fixMatrix(p_matrix);
        if (p_matrix.length != ColorChange.LENGTH) {
            return;
        }
        this.multiplyMatrix(p_matrix);
    };
    // public clone(): ColorChange {
    //     return new ColorChange(this);
    // }
    ColorChange.prototype.toString = function () {
        return "ColorChange [ " + this.data.join(" , ") + " ]";
    };
    // return a length 20 array (5x4):
    ColorChange.prototype.toArray = function () {
        return this.data.slice(0, 20);
    };
    // private methods:
    // copy the specified matrix's values to this matrix:
    ColorChange.prototype.copyMatrix = function (p_matrix) {
        var l = ColorChange.LENGTH;
        for (var i = 0; i < l; i++) {
            this.data[i] = p_matrix[i];
        }
    };
    // multiplies one matrix against another:
    ColorChange.prototype.multiplyMatrix = function (p_matrix) {
        var col = [];
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                col[j] = this.data[j + i * 5];
            }
            for (var j = 0; j < 5; j++) {
                var val = 0;
                for (var k = 0; k < 5; k++) {
                    val += p_matrix[j + k * 5] * col[k];
                }
                this.data[j + i * 5] = val;
            }
        }
    };
    // make sure values are within the specified range, hue has a limit of 180, others are 100:
    ColorChange.prototype.cleanValue = function (p_val, p_limit) {
        return Math.min(p_limit, Math.max(-p_limit, p_val));
    };
    // makes sure matrixes are 5x5 (25 long):
    ColorChange.prototype.fixMatrix = function (p_matrix) {
        if (p_matrix === void 0) { p_matrix = null; }
        if (p_matrix == null) {
            return ColorChange.IDENTITY_MATRIX;
        }
        if (p_matrix instanceof ColorChange) {
            p_matrix = p_matrix.slice(0);
        }
        if (p_matrix.length < ColorChange.LENGTH) {
            p_matrix = p_matrix.slice(0, p_matrix.length).concat(ColorChange.IDENTITY_MATRIX.slice(p_matrix.length, ColorChange.LENGTH));
        }
        else if (p_matrix.length > ColorChange.LENGTH) {
            p_matrix = p_matrix.slice(0, ColorChange.LENGTH);
        }
        return p_matrix;
    };
    ColorChange.DELTA_INDEX = [
        0, 0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1, 0.11,
        0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.21, 0.22, 0.24,
        0.25, 0.27, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42,
        0.44, 0.46, 0.48, 0.5, 0.53, 0.56, 0.59, 0.62, 0.65, 0.68,
        0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98,
        1.0, 1.06, 1.12, 1.18, 1.24, 1.30, 1.36, 1.42, 1.48, 1.54,
        1.60, 1.66, 1.72, 1.78, 1.84, 1.90, 1.96, 2.0, 2.12, 2.25,
        2.37, 2.50, 2.62, 2.75, 2.87, 3.0, 3.2, 3.4, 3.6, 3.8,
        4.0, 4.3, 4.7, 4.9, 5.0, 5.5, 6.0, 6.5, 6.8, 7.0,
        7.3, 7.5, 7.8, 8.0, 8.4, 8.7, 9.0, 9.4, 9.6, 9.8,
        10.0
    ];
    // identity matrix constant:
    ColorChange.IDENTITY_MATRIX = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 1
    ];
    ColorChange.LENGTH = ColorChange.IDENTITY_MATRIX.length;
    return ColorChange;
}());
__reflect(ColorChange.prototype, "ColorChange");
window["ColorChange"] = ColorChange;
var NAniBx = (function (_super) {
    __extends(NAniBx, _super);
    function NAniBx(imgs, overAndRemove, frameRate) {
        if (overAndRemove === void 0) { overAndRemove = true; }
        if (frameRate === void 0) { frameRate = 6; }
        var _this = _super.call(this, overAndRemove) || this;
        _this.Setup(imgs, frameRate);
        return _this;
    }
    NAniBx.prototype.Setup = function (imgs, frameRate) {
        var _this = this;
        if (frameRate === void 0) { frameRate = 9; }
        var imgs1 = null;
        if (typeof imgs == "string") {
            imgs1 = new Arr();
            var assertList = Assert.aniAssertList;
            assertList.EachKey(function (fi) {
                if (fi.StartWith(imgs + "_")) {
                    imgs1.Add(fi);
                }
            });
        }
        if (imgs1) {
            imgs = imgs1;
        }
        var arr = imgs;
        this.enterFrame = function (times) {
            _this.img.SetVal(arr.getItemAt(times));
        };
        this.frameRate = frameRate;
        this.Load(arr);
    };
    return NAniBx;
}(NAniBase));
__reflect(NAniBx.prototype, "NAniBx");
window["NAniBx"] = NAniBx;
//sdp coco格式
var NAniSdp = (function (_super) {
    __extends(NAniSdp, _super);
    function NAniSdp(resPath, actPath, loaded, overAndRemove, frameRate) {
        if (loaded === void 0) { loaded = null; }
        if (overAndRemove === void 0) { overAndRemove = true; }
        if (frameRate === void 0) { frameRate = 12; }
        var _this = _super.call(this) || this;
        _this.totalFrame = 0;
        _this.frames = [];
        _this._stop = false;
        _this._stopAtEnd = false;
        _this._timerHandleIndex = 0;
        _this._frame = 0;
        _this._frameRate = 12;
        _this.overAndRemove = overAndRemove;
        _this.actPath = actPath;
        NAniXml.Load(resPath, function (actList) {
            NForm.LazyCall(function () {
                if (actList == null) {
                    return;
                }
                _this.actList = actList;
                _this.LoadAct(actPath);
            });
        }, false);
        return _this;
    }
    NAniSdp.prototype.LoadAct = function (actPath, loaded, overAndRemove, frameRate) {
        var _this = this;
        if (loaded === void 0) { loaded = null; }
        if (overAndRemove === void 0) { overAndRemove = true; }
        if (frameRate === void 0) { frameRate = 12; }
        if (this.disposed) {
            return;
        }
        Src.ReadTxt(Config.icoPath + actPath + ".xml", (function (data) {
            if (_this.disposed) {
                return;
            }
            if (data == null || data.length == 0) {
                return;
            }
            _this.frameRate = frameRate;
            var xml = new Xml(data);
            var nodes = xml.nodes;
            //Js.Trace(nodes);
            _this.skeletonTrees = [];
            _this.skeletonActions = [];
            _this.skeletonSkins = [];
            nodes.forEach(function (fi) {
                if (fi.type == "SkeletonTree") {
                    _this.skeletonTrees.push(fi);
                }
                else if (fi.type == "SkeletonAction") {
                    _this.skeletonActions.push(fi);
                }
                else if (fi.type == "SkeletonSkin") {
                    _this.skeletonSkins.push(fi);
                }
            });
            _this.skeletonActions = _this.skeletonActions.sort(function (a1, a2) {
                return a1.Tag.ToInt() - a2.Tag.ToInt();
            });
            _this.skeletonSkins = _this.skeletonSkins.sort(function (a1, a2) {
                return a1.Tag.ToInt() - a2.Tag.ToInt();
            });
            _this.totalFrame = _this.skeletonActions[0].TotalFrame;
            _this.frameRate = frameRate;
            _this.ani = new Sx();
            _this.Add(_this.ani);
            _this.TimerHandle();
            if (loaded) {
                loaded();
            }
        }));
    };
    NAniSdp.prototype.Play = function (name, playEndFunc) {
        if (playEndFunc === void 0) { playEndFunc = null; }
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
    };
    NAniSdp.prototype.TimerHandle = function () {
        var _this = this;
        if (!this.ani) {
            return;
        }
        this._timerHandleIndex++;
        var _timerHandleIndex1 = this._timerHandleIndex;
        NForm.SetInterval(1000 / this.frameRate, function () {
            if (_this.disposed) {
                return true;
            }
            if (_timerHandleIndex1 != _this._timerHandleIndex) {
                return true;
            }
            if (!_this._stop) {
                if (_this.totalFrame > 0) {
                    if (_this._frame >= _this.totalFrame) {
                        if (_this.playEndFunc) {
                            _this.playEndFunc();
                            _this.playEndFunc = null;
                        }
                        if (_this.overAndRemove) {
                            _this.Dispose();
                            return true;
                        }
                        if (_this._stopAtEnd) {
                            _this.Stop();
                        }
                        _this._frame = 0;
                        for (var i = 0, len = _this.skeletonSkins.length; i < len; i++) {
                            var skeletonSkin = _this.skeletonSkins[i];
                            skeletonSkin.img = "";
                            if (skeletonSkin.bx) {
                                skeletonSkin.bx.RemoveMe();
                                skeletonSkin.bx = null;
                            }
                        }
                    }
                    var _loop_1 = function (i, len) {
                        var skeletonSkin = _this.skeletonSkins[i];
                        if (skeletonSkin.oxs) {
                            for (var j = 0, lenj = skeletonSkin.oxs.length; j < lenj; j++) {
                                var fi = skeletonSkin.oxs[j];
                                if (_this._frame == fi.Frame.ToInt()) {
                                    if (skeletonSkin.img != fi.Name) {
                                        skeletonSkin.img = fi.Name;
                                        if (skeletonSkin.bx) {
                                            skeletonSkin.bx.RemoveMe();
                                        }
                                        if (_this.actList.length == 0) {
                                            var bx = Assert.Img(Config.icoPath + _this.actPath.substr(0, _this.actPath.lastIndexOf("/")) + "/" + skeletonSkin.img);
                                            _this.ani.Add(bx);
                                            skeletonSkin.bx = bx;
                                        }
                                        else if (_this.actList[skeletonSkin.img]) {
                                            var bx = new Bx(_this.actList[skeletonSkin.img][0].texture);
                                            _this.ani.Add(bx);
                                            skeletonSkin.bx = bx;
                                        }
                                        else {
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
                        var skeletonAction = _this.skeletonActions[i];
                        //Js.Trace(skeletonSkin.Tag + ":" + skeletonAction.Tag);
                        if (skeletonAction.oxs) {
                            var nextData = false;
                            for (var j = 0, lenj = skeletonAction.oxs.length; j < lenj; j++) {
                                var fi = skeletonAction.oxs[j];
                                if (_this._frame == fi.Frame.ToInt()) {
                                    skeletonAction.data = fi;
                                    nextData = true;
                                }
                                if (nextData) {
                                    skeletonAction.nextData = fi;
                                    break;
                                }
                            }
                            if (skeletonSkin.bx && skeletonAction.data) {
                                skeletonSkin.bx.OnLoaded(function () {
                                    skeletonSkin.bx.anchorOffsetX = skeletonSkin.bx.width * parseFloat(skeletonAction.AnchorX);
                                    skeletonSkin.bx.anchorOffsetY = skeletonSkin.bx.height * parseFloat(skeletonAction.AnchorY);
                                    skeletonSkin.bx.x = -_this.GetFrameVal(skeletonAction.data, skeletonAction.nextData, "PosX");
                                    skeletonSkin.bx.y = -_this.GetFrameVal(skeletonAction.data, skeletonAction.nextData, "PosY");
                                    skeletonSkin.bx.scaleX = _this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "ScaleX");
                                    skeletonSkin.bx.scaleY = _this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "ScaleY");
                                    skeletonSkin.bx.skewX = _this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "SkewX");
                                    skeletonSkin.bx.skewY = _this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "SkewY");
                                    skeletonSkin.bx.alpha = _this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "Opacity") / 255;
                                    skeletonSkin.bx.rotation = _this.GetFrameValTween(skeletonAction.data, skeletonAction.nextData, "Rot");
                                    if (skeletonAction.data.Visible == "1") {
                                        skeletonSkin.bx.Show();
                                    }
                                    else {
                                        skeletonSkin.bx.Hide();
                                    }
                                    //TODO:Color
                                });
                            }
                        }
                    };
                    for (var i = 0, len = _this.skeletonSkins.length; i < len; i++) {
                        _loop_1(i, len);
                    }
                    _this._frame++;
                }
            }
            return false;
        });
    };
    NAniSdp.prototype.GetFrameVal = function (data1, data2, key) {
        return parseFloat(data1[key]);
    };
    NAniSdp.prototype.GetFrameValTween = function (data1, data2, key) {
        if (!data2) {
            return parseFloat(data1[key]);
        }
        if (data1.Frame == data1.Frame) {
            return parseFloat(data1[key]);
        }
        return (parseFloat(data2[key]) - parseFloat(data1[key])) * (this._frame - data1.Frame) / (data2.Frame - data1.Frame) + parseFloat(data1[key]);
    };
    NAniSdp.prototype.StopAtEnd = function () {
        this._stopAtEnd = true;
    };
    NAniSdp.prototype.Stop = function () {
        this._stop = true;
    };
    NAniSdp.prototype.Continue = function () {
        this._stop = false;
    };
    NAniSdp.prototype.End = function (ev) {
        if (this.overAndRemove) {
            this.Dispose();
        }
    };
    Object.defineProperty(NAniSdp.prototype, "frameRate", {
        get: function () {
            return this._frameRate;
        },
        set: function (val) {
            if (val <= 0) {
                val = 12;
            }
            if (this._frameRate != val) {
                this._frameRate = val;
                this.TimerHandle();
            }
        },
        enumerable: true,
        configurable: true
    });
    return NAniSdp;
}(Sx));
__reflect(NAniSdp.prototype, "NAniSdp");
window["NAniSdp"] = NAniSdp;
var NAniSx = (function (_super) {
    __extends(NAniSx, _super);
    function NAniSx(dis, stateFrom, stateTo, frames, backForth, finishFunc, overAndRemove) {
        if (backForth === void 0) { backForth = false; }
        if (finishFunc === void 0) { finishFunc = null; }
        if (overAndRemove === void 0) { overAndRemove = true; }
        var _this = _super.call(this, overAndRemove) || this;
        _this.Setup(dis, stateFrom, stateTo, frames, backForth, finishFunc);
        return _this;
    }
    NAniSx.prototype.Setup = function (dis, stateFrom, stateTo, framesCount, backForth, finishFunc) {
        var _this = this;
        if (backForth === void 0) { backForth = false; }
        if (finishFunc === void 0) { finishFunc = null; }
        this.backForth = backForth;
        this.intervalObj = {};
        this.framesCount = framesCount;
        this.finishFunc = finishFunc;
        this.dis = dis;
        _super.prototype.Add.call(this, dis);
        var arr = new Arr();
        if (backForth) {
            for (var i = 0; i < framesCount * 2; i++) {
                arr.Add(this);
            }
        }
        else {
            for (var i = 0; i < framesCount; i++) {
                arr.Add(this);
            }
        }
        for (var fi in stateFrom) {
            this.intervalObj[fi] = (stateTo[fi] - stateFrom[fi]) / this.framesCount;
        }
        this.enterFrame = function (times) {
            if (backForth) {
                var curTimes = times;
                if (curTimes >= framesCount) {
                    for (var fi in stateFrom) {
                        dis[fi] = stateTo[fi] - (curTimes - framesCount + 1) * _this.intervalObj[fi];
                    }
                    if (curTimes == framesCount * 2 - 1) {
                        if (finishFunc) {
                            finishFunc();
                        }
                    }
                }
                else {
                    for (var fi in stateFrom) {
                        dis[fi] = stateFrom[fi] + curTimes * _this.intervalObj[fi];
                    }
                }
            }
            else {
                var curTimes = times;
                for (var fi in stateFrom) {
                    dis[fi] = stateFrom[fi] + curTimes * _this.intervalObj[fi];
                }
                if (curTimes == framesCount - 1) {
                    if (finishFunc) {
                        finishFunc();
                    }
                }
            }
        };
        this.Load(arr);
    };
    Object.defineProperty(NAniSx.prototype, "width", {
        get: function () {
            return this.dis.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NAniSx.prototype, "height", {
        get: function () {
            return this.dis.height;
        },
        enumerable: true,
        configurable: true
    });
    return NAniSx;
}(NAniBase));
__reflect(NAniSx.prototype, "NAniSx");
window["NAniSx"] = NAniSx;
var NAniXml = (function (_super) {
    __extends(NAniXml, _super);
    function NAniXml(path, name, overAndRemove, frameRate) {
        if (overAndRemove === void 0) { overAndRemove = true; }
        if (frameRate === void 0) { frameRate = 12; }
        var _this = _super.call(this) || this;
        _this._stop = false;
        _this._stopAtEnd = false;
        _this._timerHandleIndex = 0;
        _this._frame = 0;
        _this._frameRate = 12;
        _this.overAndRemove = overAndRemove;
        _this.path = path;
        NAniXml.Load(path, function (actList) {
            NForm.LazyCall(function () {
                if (actList == null) {
                    Js.Trace("NAniXml actList null: " + path);
                    _this.RemoveMe();
                    _this.Dispose();
                    return;
                }
                if (_this.disposed) {
                    return;
                }
                try {
                    _this.actList = actList;
                    _this.frameRate = frameRate;
                    _this.ani = new Bx(null);
                    _this.info = _this.actList.GetValue(0)[0];
                    if (_this.info) {
                        _this.info.texture.Keep();
                    }
                    _this.Add(_this.ani);
                    _this.Play(name);
                    _this.TimerHandle();
                }
                catch (ex) {
                    Js.Trace(ex);
                }
                if (_this.loadedFuncList) {
                    _this.loadedFuncList.Each(function (fi) {
                        fi();
                    });
                }
                // if (this._frameRate > 0) {
                //     this.frameRate = this._frameRate;
                // }
            });
        });
        return _this;
    }
    NAniXml.LoadOne = function (path, actList, fullImg, func) {
        if (fullImg === void 0) { fullImg = true; }
        if (NAniXml.oneActList == null) {
            NAniXml.oneActList = new Listx();
        }
        if (NAniXml.oneActList.Exists(path)) {
            try {
                var list_1 = NAniXml.oneActList[path];
                if (!list_1.GetValue(0)[0].texture.disposed) {
                    NForm.LazyCall(function () {
                        func(list_1);
                    });
                    return;
                }
            }
            catch (ex) {
                Js.Trace(ex);
            }
        }
        Src.ReadTxt(Config.icoPath + path + ".xml", (function (data) {
            Src.Read(Config.icoPath + path + ".png", (function (textures) {
                //Js.Trace(textures);
                NForm.LazyCall(function () {
                    if (NAniXml.oneActList.Exists(path)) {
                        try {
                            var list = NAniXml.oneActList[path];
                            if (!list.GetValue(0)[0].texture.disposed) {
                                func(list);
                                return;
                            }
                        }
                        catch (ex) {
                            Js.Trace(ex);
                        }
                    }
                    if (data == null || data.length == 0 || textures == null) {
                        func(null);
                        return;
                    }
                    Js.Trace(path);
                    // data = data.replace(/TextureAtlas/g, "root");
                    // data = data.replace(/SubTexture/g, "ox");
                    var xml = new Xml(data);
                    var index = 0;
                    xml.nodes.forEach(function (fi) {
                        var act = fi.name;
                        var names = fi.name.split("_");
                        index++;
                        ////////////////////////////////////
                        if (NAniXml.getNameFunc) {
                            act = NAniXml.getNameFunc(names, path);
                        }
                        else {
                            act = path.split("/")[1];
                        }
                        if (NAniXml.getIndexFunc) {
                            index = NAniXml.getIndexFunc(names, path);
                        }
                        ////////////////////////////////////
                        fi.index = index;
                        if (!actList.Exists(act)) {
                            actList[act] = [];
                        }
                        actList[act].push(fi);
                        var t = new egret.Texture();
                        t.$bitmapData = textures.bitmapData;
                        if (fullImg) {
                            if (typeof fi.frameX == "undefined") {
                                fi.frameX = 0;
                            }
                            if (typeof fi.frameY == "undefined") {
                                fi.frameY = 0;
                            }
                            if (fi.sourceWidth) {
                                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.sourceWidth, fi.sourceHeight, textures.bitmapWidth, textures.bitmapHeight, fi.rotated);
                            }
                            else if (fi.frameWidth) {
                                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.frameWidth, fi.frameHeight, textures.bitmapWidth, textures.bitmapHeight, fi.rotated);
                            }
                            else {
                                t.$initData(fi.x, fi.y, fi.width, fi.height, -fi.frameX, -fi.frameY, fi.width, fi.height, textures.bitmapWidth, textures.bitmapHeight, fi.rotated);
                            }
                        }
                        else {
                            t.$initData(fi.x, fi.y, fi.width, fi.height, 0, 0, fi.width, fi.height, textures.bitmapWidth, textures.bitmapHeight, fi.rotated);
                        }
                        fi.texture = Textures.GetTextures(t, textures.path);
                    });
                    actList.EachKey(function (key) {
                        actList[key] = actList[key].sort(function (a1, a2) {
                            return a1.index - a2.index;
                        });
                    });
                    NAniXml.oneActList[path] = actList;
                    func(actList);
                });
            }));
        }));
    };
    NAniXml.Load = function (path, func, fullImg, actList) {
        if (fullImg === void 0) { fullImg = true; }
        if (actList === void 0) { actList = null; }
        if (actList == null) {
            actList = new Listx();
        }
        if (path == -1) {
            if (func) {
                func(actList);
            }
        }
        else {
            var paths = null;
            if (typeof path == "string") {
                paths = [];
                paths.push(path);
            }
            else {
                paths = path;
            }
            if (paths.length == 0) {
                if (func) {
                    func(actList);
                }
            }
            else {
                var p = paths.splice(0, 1)[0];
                NAniXml.LoadOne(p, actList, fullImg, function (res) {
                    NAniXml.Load(paths, func, fullImg, res);
                });
            }
        }
    };
    NAniXml.prototype.Play = function (name, playEndFunc) {
        if (playEndFunc === void 0) { playEndFunc = null; }
        if (this.ani) {
            this.name = name;
            this._frame = 0;
            if (playEndFunc) {
                this.playEndFunc = playEndFunc;
            }
        }
    };
    NAniXml.prototype.TimerHandle = function () {
        var _this = this;
        if (!this.ani) {
            return;
        }
        this._timerHandleIndex++;
        var _timerHandleIndex1 = this._timerHandleIndex;
        NForm.SetInterval(1000 / this.frameRate, function () {
            var path = _this.path;
            if (_this.disposed) {
                return true;
            }
            if (_timerHandleIndex1 != _this._timerHandleIndex) {
                return true;
            }
            if (!_this.topVisible) {
                return;
            }
            if (!_this._stop || _this.ani.$bitmapData == null) {
                if (_this.name.IsFull()) {
                    var arr = _this.actList[_this.name];
                    if (arr == null || arr.length == 0) {
                        if (Js.showTrace) {
                            throw new Error("Error nanixml: " + _this.path + " name:" + _this.name);
                        }
                    }
                    if (arr && arr.length > 0) {
                        if (_this._frame >= arr.length) {
                            if (_this.playEndFunc) {
                                _this.playEndFunc();
                                _this.playEndFunc = null;
                            }
                            if (_this.playEndFunc2) {
                                _this.playEndFunc2();
                                _this.playEndFunc2 = null;
                            }
                            if (_this.overAndRemove) {
                                _this.Dispose();
                                return true;
                            }
                            if (_this._stopAtEnd) {
                                _this.Stop();
                            }
                            _this._frame = 0;
                        }
                        if (_this.ani) {
                            _this.ani.SetBitmap(arr[_this._frame].texture);
                        }
                        _this._frame++;
                    }
                }
                else {
                    var arr = _this.actList;
                    if (arr == null || arr.length == 0 || arr.length == 1) {
                        if (Js.showTrace) {
                            throw new Error("Error nanixml: " + _this.path + " name:" + _this.name);
                        }
                    }
                    if (arr && arr.length > 0) {
                        if (_this._frame >= arr.length) {
                            if (_this.playEndFunc) {
                                _this.playEndFunc();
                                _this.playEndFunc = null;
                            }
                            if (_this.playEndFunc2) {
                                _this.playEndFunc2();
                                _this.playEndFunc2 = null;
                            }
                            if (_this.overAndRemove) {
                                _this.Dispose();
                                return true;
                            }
                            if (_this._stopAtEnd) {
                                _this.Stop();
                            }
                            _this._frame = 0;
                        }
                        _this.ani.SetBitmap(arr.GetValue(_this._frame)[0].texture);
                        //Js.Trace(this.ani.width);
                        _this._frame++;
                    }
                }
            }
            return false;
        });
    };
    Object.defineProperty(NAniXml.prototype, "width", {
        get: function () {
            if (this.info) {
                return this.info.frameWidth;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NAniXml.prototype, "height", {
        get: function () {
            if (this.info) {
                return this.info.frameHeight;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    NAniXml.prototype.StopAtEnd = function () {
        this._stopAtEnd = true;
    };
    NAniXml.prototype.Stop = function () {
        this._stop = true;
    };
    NAniXml.prototype.Continue = function () {
        this._stop = false;
    };
    NAniXml.prototype.End = function (ev) {
        if (this.overAndRemove) {
            this.Dispose();
        }
    };
    Object.defineProperty(NAniXml.prototype, "frameRate", {
        get: function () {
            return this._frameRate;
        },
        set: function (val) {
            if (val <= 0) {
                val = 12;
            }
            if (this._frameRate != val) {
                this._frameRate = val;
                this.TimerHandle();
            }
        },
        enumerable: true,
        configurable: true
    });
    NAniXml.prototype.OnLoaded = function (func) {
        if (this.loadedFuncList == null) {
            this.loadedFuncList = new Arr();
        }
        this.loadedFuncList.Add(func);
    };
    NAniXml.prototype.Dispose = function () {
        this.playEndFunc = null;
        this.playEndFunc2 = null;
        this.actList = null;
        if (this.info) {
            this.info.texture.Release();
        }
        this.info = null;
        this.ani = null;
        _super.prototype.Dispose.call(this);
    };
    return NAniXml;
}(Sx));
__reflect(NAniXml.prototype, "NAniXml");
window["NAniXml"] = NAniXml;
var Csv = (function () {
    function Csv(text) {
        var _this = this;
        this.nodes = [];
        this.keys = {};
        this.keyArr = [];
        if (text == null || text.IsEmpty()) {
            return;
        }
        var row = 0;
        var vals = [];
        var extra = false;
        var extraD = false;
        var cell = [];
        var _loop_2 = function (i, len) {
            var c = text.charAt(i);
            if (c == ",") {
                if (extra) {
                    cell.push(c);
                }
                else {
                    var cellVal = cell.join("");
                    vals.push(cellVal);
                    cell.length = 0;
                    extra = false;
                }
            }
            else if (c == "\n" || c == "\r") {
                if (vals.length > 0) {
                    var cellVal = cell.join("");
                    vals.push(cellVal);
                    cell.length = 0;
                    extra = false;
                    if (row == 0) {
                        vals.forEach(function (fi) {
                            _this.keyArr.push(fi);
                            _this.keys[fi] = true;
                        });
                    }
                    else {
                        var obj_2 = {};
                        var index_2 = 0;
                        this_1.keyArr.forEach(function (fi) {
                            obj_2[fi] = vals[index_2];
                            index_2++;
                        });
                        this_1.nodes.push(obj_2);
                    }
                    vals.length = 0;
                }
                else {
                    cell.length = 0;
                    extra = false;
                }
                row++;
            }
            else {
                if (cell.length == 0 && c == "\"") {
                    extra = true;
                }
                else {
                    if (extra) {
                        if (!extraD && c == "\\") {
                            extraD = true;
                        }
                        else {
                            if (c == "\"") {
                                extra = false;
                            }
                            else {
                                cell.push(c);
                            }
                            extraD = false;
                        }
                    }
                    else {
                        cell.push(c);
                    }
                }
            }
        };
        var this_1 = this;
        for (var i = 0, len = text.length; i < len; i++) {
            _loop_2(i, len);
        }
        //Js.Trace(row);
    }
    return Csv;
}());
__reflect(Csv.prototype, "Csv");
window["Csv"] = Csv;
var DateTime = (function () {
    function DateTime(d) {
        if (d === void 0) { d = null; }
        if (d == null) {
            d = new Date();
        }
        else if (d instanceof Date) {
            this.d = d;
        }
        else if (Strx.IsString(d)) {
            this.d = Time.ParseTime(d.toString());
        }
        else {
            d = new Date();
        }
    }
    Object.defineProperty(DateTime.prototype, "time", {
        get: function () {
            return this.d.getTime();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "tick", {
        get: function () {
            return this.time;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "Year", {
        get: function () {
            return this.d.getFullYear().ToInt();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "Month", {
        get: function () {
            return this.d.getMonth().ToInt();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "DayOfWeek", {
        // public get DayOfYear(): number {
        //     return this.Month * 31 + this.d.getDate().ToInt();
        // }
        get: function () {
            return this.d.getDay().ToInt();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "Day", {
        get: function () {
            return this.d.getDate().ToInt();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "Hour", {
        get: function () {
            return this.d.getHours().ToInt();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "Minute", {
        get: function () {
            return this.d.getMinutes().ToInt();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "Second", {
        get: function () {
            return this.d.getSeconds().ToInt();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTime.prototype, "Millisecond", {
        get: function () {
            return this.d.getMilliseconds().ToInt();
        },
        enumerable: true,
        configurable: true
    });
    DateTime.prototype.Add = function (t) {
        var dt = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + t.TotalMilliseconds);
        return dt;
    };
    DateTime.prototype.AddDays = function (val) {
        var dt = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + val * 24 * 60 * 60 * 1000);
        return dt;
    };
    DateTime.prototype.AddHours = function (val) {
        var dt = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + val * 60 * 60 * 1000);
        return dt;
    };
    DateTime.prototype.AddMinutes = function (val) {
        var dt = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + val * 60 * 1000);
        return dt;
    };
    DateTime.prototype.AddSeconds = function (val) {
        var dt = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + val * 1000);
        return dt;
    };
    DateTime.prototype.AddMilliseconds = function (val) {
        var dt = new DateTime(new Date(this.d.getTime()));
        dt.d.setTime(dt.d.getTime() + val);
        return dt;
    };
    DateTime.prototype.toString = function (withMilliseconds) {
        if (withMilliseconds === void 0) { withMilliseconds = false; }
        if (withMilliseconds) {
            return Time.ParseStringWithMilliseconds(this.d);
        }
        else {
            return Time.ParseString(this.d);
        }
    };
    return DateTime;
}());
__reflect(DateTime.prototype, "DateTime");
window["DateTime"] = DateTime;
///<reference path="NColorText.ts" />
var NBColorText = (function (_super) {
    __extends(NBColorText, _super);
    function NBColorText(item, bindKey, bold, size, style, act) {
        if (bindKey === void 0) { bindKey = ""; }
        if (bold === void 0) { bold = false; }
        if (size === void 0) { size = 13; }
        if (style === void 0) { style = 0; }
        if (act === void 0) { act = null; }
        var _this = _super.call(this, "", bold, size, style) || this;
        _this.Bind(item, bindKey, act);
        return _this;
    }
    NBColorText.prototype.ChangeBind = function (item) {
        if (this.item != item) {
            this.Bind(item, this.bindKey, this.act);
        }
    };
    return NBColorText;
}(NColorText));
__reflect(NBColorText.prototype, "NBColorText");
window["NBColorText"] = NBColorText;
///<reference path="NLabel.ts" />
var NBKLabel = (function (_super) {
    __extends(NBKLabel, _super);
    function NBKLabel(key, item, bindKey, keyType, color, bold, size, act) {
        if (bindKey === void 0) { bindKey = ""; }
        if (keyType === void 0) { keyType = 17; }
        if (color === void 0) { color = -1; }
        if (bold === void 0) { bold = false; }
        if (size === void 0) { size = -1; }
        if (act === void 0) { act = null; }
        var _this = _super.call(this, "", color, bold, size) || this;
        _this.keyType = keyType;
        if (Strx.IsFull(key)) {
            _this.key = key;
        }
        _this.Bind(item, bindKey, act);
        return _this;
    }
    NBKLabel.prototype.ChangeBind = function (item) {
        if (this.item != item) {
            this.Bind(item, this.bindKey, this.act);
        }
    };
    return NBKLabel;
}(NLabel));
__reflect(NBKLabel.prototype, "NBKLabel");
window["NBKLabel"] = NBKLabel;
///<reference path="NLabel.ts" />
var NBLabel = (function (_super) {
    __extends(NBLabel, _super);
    function NBLabel(item, bindKey, color, bold, size, act, stroke, strokeColor) {
        if (bindKey === void 0) { bindKey = ""; }
        if (color === void 0) { color = -1; }
        if (bold === void 0) { bold = false; }
        if (size === void 0) { size = -1; }
        if (act === void 0) { act = null; }
        if (stroke === void 0) { stroke = 0; }
        if (strokeColor === void 0) { strokeColor = -1; }
        var _this = _super.call(this, "", color, bold, size, stroke, strokeColor) || this;
        _this.Bind(item, bindKey, act);
        return _this;
    }
    NBLabel.prototype.ChangeBind = function (item) {
        if (this.item != item) {
            this.Bind(item, this.bindKey, this.act);
        }
    };
    return NBLabel;
}(NLabel));
__reflect(NBLabel.prototype, "NBLabel");
window["NBLabel"] = NBLabel;
var NButton = (function (_super) {
    __extends(NButton, _super);
    function NButton(val, style, highLight, filterDoubleClickTime) {
        if (style === void 0) { style = -1; }
        if (highLight === void 0) { highLight = true; }
        if (filterDoubleClickTime === void 0) { filterDoubleClickTime = -1; }
        var _this = _super.call(this) || this;
        _this.filterDoubleClickTime = -1;
        _this._filterDoubleClick = false;
        _this._val = val;
        _this.filterDoubleClickTime = filterDoubleClickTime;
        ////////////////////////
        _this.bg = NButton.bgRender(style);
        var sp = new Sx();
        sp.Add(_this.bg);
        if (val.indexOf("/") > -1) {
            _this.l = Assert.Img(val);
            _this.l.OnLoaded((function () {
                _this.l.Pos((_this.w - _this.l.width) / 2, (_this.h - _this.l.height) / 2);
            }).bind(_this));
            _this.l.mouseEnabled = false;
            sp.Add(_this.l);
        }
        else if (val.indexOf(".") > -1) {
            _this.l = Assert.Img("lang/" + val);
            _this.l.OnLoaded((function () {
                _this.l.Pos((_this.w - _this.l.width) / 2, (_this.h - _this.l.height) / 2);
            }).bind(_this));
            _this.l.mouseEnabled = false;
            sp.Add(_this.l);
        }
        else {
            var _val = val;
            _val = Lang.PT(_val);
            _this.l = NButton.lRender(style, _val, _this.bg.width, _this.bg.height);
            _this.l.mouseEnabled = false;
            sp.Add(_this.l);
        }
        ////////////////////////
        ////////////////////////
        _this.bgOn = NButton.bgOnRender(style);
        var spOn = null;
        if (_this.bgOn) {
            spOn = new Sx();
            spOn.Add(_this.bgOn);
            if (val.indexOf(".") > -1) {
                _this.lOn = Assert.Img("lang/" + val);
                _this.lOn.OnLoaded((function () {
                    _this.lOn.Pos((_this.w - _this.lOn.width) / 2, (_this.h - _this.lOn.height) / 2);
                }).bind(_this));
                _this.lOn.mouseEnabled = false;
                spOn.Add(_this.lOn);
            }
            else {
                var _val = val;
                _val = Lang.PT(_val);
                _this.lOn = NButton.lOnRender(style, _val, _this.bg.width, _this.bg.height);
                if (_this.lOn == null) {
                    _this.lOn = NButton.lRender(style, _val, _this.bg.width, _this.bg.height);
                }
                _this.lOn.mouseEnabled = false;
                spOn.Add(_this.lOn);
            }
        }
        ////////////////////////
        _this.buttonMode = true;
        _this.b = new NSButton(sp, spOn, NSButton.musicBG, highLight, filterDoubleClickTime);
        _this.Add(_this.b);
        var that = _this;
        return _this;
        //this.b.Off();
    }
    Object.defineProperty(NButton.prototype, "val", {
        get: function () {
            return this._val;
        },
        set: function (val) {
            if (this.l) {
                this.l.val = val;
            }
            if (this.lOn) {
                this.lOn.val = val;
            }
            this._val = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NButton.prototype, "width", {
        get: function () {
            return this.bg.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NButton.prototype, "height", {
        get: function () {
            return this.bg.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NButton.prototype, "w", {
        get: function () {
            return this.bg.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NButton.prototype, "h", {
        get: function () {
            return this.bg.height;
        },
        enumerable: true,
        configurable: true
    });
    NButton.prototype.On = function () {
        this.b.On();
    };
    NButton.prototype.Off = function () {
        this.b.Off();
    };
    return NButton;
}(Sx));
__reflect(NButton.prototype, "NButton");
window["NButton"] = NButton;
var NCheck = (function (_super) {
    __extends(NCheck, _super);
    function NCheck(val, width, height, act, color) {
        if (color === void 0) { color = 0xfffbd4; }
        var _this = _super.call(this) || this;
        _this.val = val;
        _this.act = act;
        _this.b = new Sx();
        _this.Add(_this.b);
        if (act == null) {
            var bg = NCheck.offStyle();
            _this.b.Add(bg);
            _this.fg = NCheck.onStyle();
            _this.fg.Hide();
            _this.b.Add(_this.fg);
            if (val.length > 2 && val.substr(0, 2) == "i:") {
                _this.l = Assert.Img(val.substr(2, val.length - 2));
                _this.Add(_this.l, bg.width + 3, (bg.height - _this.l.height) / 2);
            }
            else {
                _this.l = new NLabel(val, 0xfffbd4, false, NCheck.fontSize);
                //this.l.filters = Filters.borderFilter;
                _this.Add(_this.l, bg.width + 2, (bg.height - _this.l.height) / 2);
            }
        }
        else {
            _this.p = new NPanel(width, height);
            act(_this.p, val);
            var b = new NSButton(_this.p);
            _this.b.Add(b, 0, 0);
        }
        if (act == null) {
            var hit = new Sx();
            _this.Add(hit);
            //				hit.beginFill(0x0);
            //				hit.drawRect(0,0,30,30);
            //				hit.endFill();
            //				hitArea=hit;//TODO:hitArea
            hit.Hide();
        }
        return _this;
    }
    Object.defineProperty(NCheck.prototype, "check", {
        get: function () {
            return this._check;
        },
        set: function (val) {
            this._check = val;
            if (this.p) {
                if (val) {
                    //this.p.filters = Filters.highLightFilter;
                }
                else {
                    this.p.filters = null;
                }
            }
            else {
                this.fg.visible = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    return NCheck;
}(Sx));
__reflect(NCheck.prototype, "NCheck");
window["NCheck"] = NCheck;
var NCountDown = (function (_super) {
    __extends(NCountDown, _super);
    function NCountDown(isTime, nnum, size, color, func) {
        if (isTime === void 0) { isTime = true; }
        if (nnum === void 0) { nnum = ""; }
        if (size === void 0) { size = -1; }
        if (color === void 0) { color = 0xffffff; }
        if (func === void 0) { func = null; }
        var _this = _super.call(this) || this;
        _this.tick = -1;
        _this.stop = 0;
        _this._defaultVal = "";
        _this.item = new Listx();
        _this.func = func;
        _this.isTime = isTime;
        _this.item["index"] = 0;
        if (nnum.IsFull()) {
            _this.l = new NNum("", nnum, false, size);
        }
        else {
            _this.l = new NLabel("", color, false, size);
        }
        _this.item.Listen(function () {
            if (isTime) {
                if (_this.item["index"].ToInt() <= 0 && _this.defaultVal.IsFull()) {
                    if (func) {
                        _this.l.val = func(_this.defaultVal);
                    }
                    else {
                        _this.l.val = _this.defaultVal;
                    }
                }
                else {
                    if (func) {
                        _this.l.val = func(Time.GetTimeSpan(_this.item["index"]));
                    }
                    else {
                        _this.l.val = Time.GetTimeSpan(_this.item["index"]);
                    }
                }
            }
            else {
                if (_this.item["index"].ToInt() == 0 && _this.defaultVal.IsFull()) {
                    if (func) {
                        _this.l.val = func(_this.defaultVal);
                    }
                    else {
                        _this.l.val = _this.defaultVal;
                    }
                }
                else {
                    if (func) {
                        _this.l.val = func(_this.item["index"]);
                    }
                    else {
                        _this.l.val = _this.item["index"];
                    }
                }
            }
        }, "index", _this.l);
        _this.Add(_this.l);
        return _this;
    }
    Object.defineProperty(NCountDown.prototype, "align", {
        get: function () {
            return this.l.align;
        },
        set: function (val) {
            this.l.align = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NCountDown.prototype, "defaultVal", {
        get: function () {
            return this._defaultVal;
        },
        set: function (val) {
            this._defaultVal = val;
            if (this.item["index"].ToInt() == 0) {
                this.l.val = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NCountDown.prototype, "val", {
        get: function () {
            return this.item["index"].ToInt();
        },
        enumerable: true,
        configurable: true
    });
    NCountDown.prototype.Start = function (allTime, finishFunc, timerFunc) {
        var _this = this;
        if (finishFunc === void 0) { finishFunc = null; }
        if (timerFunc === void 0) { timerFunc = null; }
        this.Stop();
        this.stop++;
        var stopIndex = this.stop;
        this.allTime = allTime;
        this.item.s("index", allTime);
        this.startTime = new Date().getTime();
        NForm.SetInterval(500, function () {
            if (stopIndex != _this.stop) {
                return stopIndex != _this.stop;
            }
            var now = new Date().getTime();
            var time1 = (now - _this.startTime) / 1000;
            var index = Math.floor(allTime + time1 * _this.tick);
            if (index < 0) {
                index = 0;
            }
            _this.item["index"] = index;
            _this.leftTime = index;
            if (timerFunc) {
                timerFunc();
            }
            if (index <= 0) {
                _this.Stop();
                if (finishFunc) {
                    finishFunc();
                }
            }
            return stopIndex != _this.stop;
        });
    };
    NCountDown.prototype.Stop = function () {
        this.stop++;
        this.item["index"] = 0;
    };
    NCountDown.prototype.StopAt = function (allTime) {
        this.stop++;
        this.item["index"] = allTime;
    };
    NCountDown.prototype.Dispose = function () {
        this.Stop();
        this.func = null;
        _super.prototype.Dispose.call(this);
    };
    return NCountDown;
}(Sx));
__reflect(NCountDown.prototype, "NCountDown");
window["NCountDown"] = NCountDown;
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
if (!String.prototype.IsFull) {
    String.prototype.IsFull = function () {
        return Strx.IsFull(this);
    };
}
if (!String.prototype.IsEmpty) {
    String.prototype.IsEmpty = function () {
        return Strx.IsEmpty(this);
    };
}
if (!String.prototype.ToInt) {
    String.prototype.ToInt = function () {
        if (this == null || this == "") {
            return 0;
        }
        var rv = parseInt(this);
        if (isNaN(rv)) {
            return 0;
        }
        return rv;
    };
}
if (!String.prototype.WriteLog) {
    String.prototype.WriteLog = function () {
        return Js.Trace(this);
    };
}
if (!String.prototype.TrueLength) {
    String.prototype.TrueLength = function () {
        // var text: string = this;
        // if (text.IsEmpty())
        //     return 0;
        // let rv = 0;
        // for (let i = 0, len = text.length; i < len; i++) {
        //     let num = text.charCodeAt(i);
        //     if (num < 0 || num > 0x7f) {
        //         rv += 2;
        //     }
        //     else {
        //         rv++;
        //     }
        // }
        // return rv;
        return Strx.TrueLength(this);
    };
}
if (!String.prototype.PaddingLeft) {
    String.prototype.PaddingLeft = function (c, count) {
        // let left = "";
        // for (let i = 0, len = count - this.length; i < len; i++) {
        //     left += c;
        // }
        // return left + this;
        return Strx.PaddingLeft(this, count, c);
    };
}
;
if (!String.prototype.PaddingRight) {
    String.prototype.PaddingRight = function (c, count) {
        return Strx.PaddingRight(this, count, c);
    };
}
;
if (!String.prototype.Trim) {
    String.prototype.Trim = function () {
        return Strx.Trim(this);
    };
}
;
if (!String.prototype.StartWith) {
    String.prototype.StartWith = function (c) {
        if (this.length >= c.length && this.substr(0, c.length) == c) {
            return true;
        }
        return false;
    };
}
;
var Strx = (function () {
    function Strx() {
    }
    Strx.Setup = function () {
    };
    Strx.Rnd = function (max) {
        max = max;
        return Math.floor(Math.random() * (max));
    };
    Strx.Int = function (text) {
        var rv = 0;
        try {
            rv = parseInt(text);
        }
        catch (ex) {
            rv = 0;
        }
        return rv;
    };
    Strx.IsEmpty = function (text) {
        if (text == null || text == undefined || text.length == 0) {
            return true;
        }
        else {
            return false;
        }
    };
    Strx.IsFull = function (text) {
        return !Strx.IsEmpty(text);
    };
    Strx.PaddingLeft = function (text, len, char) {
        if (text.length >= len) {
            return text.substr(0, len);
        }
        else {
            var needLen = len - text.length;
            for (var i = 0; i < needLen; i++) {
                text = char + text;
            }
        }
        return text;
    };
    Strx.PaddingRight = function (text, len, char) {
        if (text.length >= len) {
            return text.substr(0, len);
        }
        else {
            var needLen = len - text.length;
            for (var i = 0; i < needLen; i++) {
                text = text + char;
            }
        }
        return text;
    };
    Strx.Trim = function (str) {
        while (str.substr(0, 1) == " ") {
            str = str.substr(1);
        }
        while (str.substr(-1, 1) == " ") {
            str = str.substr(0, str.length - 1);
        }
        return str;
    };
    Strx.GetSmaNum = function (val) {
        var wanText = "";
        if (Lang.type == LangType.Cht) {
            wanText = "萬";
        }
        else {
            wanText = "万";
        }
        if (val < 10000) {
            return val.toString();
        }
        else {
            var left = (val / 10000).ToInt();
            var right = val - left * 10000;
            if (right == 0) {
                return left + wanText;
            }
            else {
                return left + "." + right.toString().substring(0, 1) + wanText;
            }
        }
    };
    Strx.TrueLength = function (text) {
        if (Strx.IsEmpty(text))
            return 0;
        var rv = 0;
        for (var i = 0, len = text.length; i < len; i++) {
            var num = text.charCodeAt(i);
            if (num < 0 || num > 0x7f) {
                rv += 2;
            }
            else {
                rv++;
            }
        }
        return rv;
    };
    Strx.Num2Str = function (d, decimal) {
        if (decimal === void 0) { decimal = 1; }
        var s = d.toString();
        if (s.indexOf(".") > -1) {
            var ss = s.split(".");
            if (ss[1].length >= decimal) {
                return ss[0] + "." + ss[1].substr(0, decimal);
            }
            else {
                return ss[0] + "." + Strx.PaddingRight(ss[1], decimal, "0");
            }
        }
        else {
            return s + "." + Strx.PaddingRight("", decimal, "0");
        }
    };
    Strx.Decompress = function (buffer) {
        var inflate = new Zlib.Inflate(buffer);
        var inbuffer = inflate.decompress();
        return inbuffer;
    };
    Strx.Encompress = function (buffer) {
        var inflate = new Zlib.Deflate(buffer);
        var inbuffer = inflate.compress();
        return inbuffer;
    };
    Strx.CalulateXYAnagle = function (startx, starty, endx, endy) {
        var tan = Math.atan(Math.abs((endy - starty) / (endx - startx))) * 180 / Math.PI;
        if (endx >= startx && endy >= starty) {
            return -tan;
        }
        else if (endx > startx && endy < starty) {
            return tan;
        }
        else if (endx < startx && endy > starty) {
            return tan - 180;
        }
        else {
            return 180 - tan;
        }
        //return tan;
    };
    Strx.GetInnerText = function (text, begin, end, times) {
        if (times === void 0) { times = 1; }
        try {
            var str = "";
            if (end.IsFull()) {
                for (var i = 1; i < times; i++) {
                    var index = text.indexOf(begin);
                    text = text.substr(index + begin.length, (text.length - index) - begin.length);
                }
                var str2 = text.substr(0, text.indexOf(begin) + begin.length);
                var str3 = text.substr(str2.length, text.length - str2.length);
                if (str3.indexOf(end) == -1) {
                    return str3;
                }
                else if (text.indexOf(begin) == -1) {
                    return str;
                }
                try {
                    return str3.substr(0, str3.indexOf(end));
                }
                catch (ex) {
                    return str3;
                }
            }
            var str4 = text.substr(0, text.indexOf(begin) + begin.length);
            return text.substr(str4.length, text.length - str4.length);
        }
        catch (ex) {
            return "";
        }
    };
    Strx.IsString = function (val) {
        if (val == null) {
            return false;
        }
        return egret.getQualifiedClassName(val) == "string";
    };
    Strx.NUMS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    Strx.CHARS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    return Strx;
}());
__reflect(Strx.prototype, "Strx");
window["Strx"] = Strx;
///<reference path="NScrollPanel.ts" />
var NGridList = (function (_super) {
    __extends(NGridList, _super);
    function NGridList(w, h, column, emptyToCount) {
        if (emptyToCount === void 0) { emptyToCount = 0; }
        var _this = _super.call(this, w, h) || this;
        _this.column = 1;
        _this._emptyToCount = 0;
        _this.animation = false;
        _this.freeStyle = false;
        _this.autoHide = false;
        _this.baseChildren = new Arr();
        _this.rowCount = 0;
        if (NGridList.empty == null) {
            NGridList.empty = Listx.Arr("id|");
        }
        _this.w = w;
        _this.h = h;
        _this.column = column;
        if (column <= 0) {
            _this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
        }
        else {
            _this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            _this.cellWidth = w / column;
        }
        _this.autoHide = true;
        //this.scroller.throwSpeed = 1;
        //this.scroller.throwSpeed = 0;
        _this.emptyToCount = emptyToCount;
        _this.sxList = new Listx();
        _this.emptyList = new Arr();
        _this.OnAdd = function (list) {
            if (_this.data) {
                if (!_this.disposed) {
                    var y = _this.scroller.viewport.scrollV;
                    _this.AddOne(list);
                    _this.LoadEmpty();
                    _this.LoadPosition();
                    NForm.LazyCall(function () {
                        //this.scroller.viewport.scrollV = y.Max(this.h - this.rowCount * this.cellHeight);//加上这句会出错
                        _this.HandleScrollHide();
                    });
                }
            }
        };
        _this.OnRemove = function (id) {
            if (_this.data) {
                if (!_this.disposed) {
                    if (_this.sxList.Exists(id)) {
                        var y = _this.scroller.viewport.scrollV;
                        _this.sxList[id].Dispose();
                        _this.sxList.Remove(id);
                        _this.LoadEmpty();
                        _this.LoadPosition();
                        NForm.LazyCall(function () {
                            //this.scroller.viewport.scrollV = y.Max(this.h - this.rowCount * this.cellHeight);//加上这句会出错
                            _this.HandleScrollHide();
                        });
                    }
                }
            }
        };
        _this.OnScrollerEnd(function (ev) {
            _this.HandleScrollHide();
        });
        return _this;
    }
    Object.defineProperty(NGridList.prototype, "emptyToCount", {
        get: function () {
            return this._emptyToCount;
        },
        set: function (val) {
            this._emptyToCount = val;
        },
        enumerable: true,
        configurable: true
    });
    NGridList.prototype.HandleScrollHide = function () {
        var _this = this;
        if (this.freeStyle) {
            return;
        }
        if (!this._disableScroll && !this._disableMask) {
            if (this.sxList) {
                this.sxList.Each((function (fi) {
                    _this.LoadOne(fi);
                }).bind(this));
            }
        }
    };
    Object.defineProperty(NGridList.prototype, "whereFunc", {
        get: function () {
            return this._whereFunc;
        },
        set: function (val) {
            this._whereFunc = val;
            if (this.sxList) {
                this.sxList.Each(function (fi) {
                    fi.SetTemp("hide", 0);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    NGridList.prototype.AddBase = function (sx, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (this.disposed) {
            return this;
        }
        //sx.ui.SetParent(this.scrollRect.content, false);//TODO:
        if (x == 0 && y == 0) {
        }
        else {
            sx.x = x;
            sx.y = y;
        }
        this.baseChildren.Add(sx);
        this.Add(sx);
        return this;
    };
    NGridList.prototype.RemoveAllBase = function () {
        if (this.disposed) {
            return;
        }
        this.baseChildren.Each(function (fi) {
            fi.RemoveMe();
        });
    };
    NGridList.prototype.SetData = function (xes, cellHeight, func, willListen, margin) {
        if (willListen === void 0) { willListen = false; }
        if (margin === void 0) { margin = 0; }
        if (this.disposed) {
            return;
        }
        if (this.data) {
            this.data.OnAddSplice(this.OnAdd);
            this.data.OnRemoveSplice(this.OnRemove);
        }
        if (this.column <= 0) {
            this.cellWidth = cellHeight;
        }
        this.cellHeight = cellHeight;
        if (this.column <= 0) {
            this.cellWidth = cellHeight;
        }
        this.func = func;
        this.margin = margin;
        if (xes == null) {
            return;
        }
        this.data = xes;
        this.Reload();
        if (willListen) {
            xes.OnAdd(this.OnAdd, this);
            xes.OnRemove(this.OnRemove, this);
        }
    };
    NGridList.prototype.Reload = function () {
        var _this = this;
        if (this.disposed) {
            return;
        }
        this.sxList.Clear();
        this.emptyList.Clear();
        this.RemoveAllBase();
        var allCount = Math.max(this.emptyToCount, this.data.Length);
        this.data.Each((function (fi) {
            _this.AddOne(fi);
        }).bind(this));
        this.LoadEmpty();
        this.LoadPosition();
    };
    NGridList.prototype.AddOne = function (list) {
        if (this.disposed) {
            return;
        }
        var p = new Sx();
        //var p = new NPanel(this.cellWidth, this.cellHeight, 1);//调试查看范围使用
        var n9 = new N9("gridlistempty");
        n9.width = this.cellWidth;
        n9.height = this.cellHeight;
        var shape = new NSButton(n9);
        // let shape = new egret.Shape();
        // shape.graphics.beginFill(0x000000, 1);
        // shape.graphics.drawRect(0, 0, this.cellWidth, this.cellHeight);
        // shape.graphics.endFill();
        p.Add(shape);
        p.SetTemp("shape", shape);
        this.AddBase(p);
        p.SetTemp("list", list);
        this.sxList.s(list["id"], p);
    };
    NGridList.prototype.LoadEmpty = function () {
        if (this.disposed) {
            return;
        }
        var index = this.sxList.Length;
        var count = this.emptyToCount - index;
        if (count > this.emptyList.length) {
            for (var i = this.emptyList.Count; i < count; i++) {
                var p = new Sx();
                var shape = new N9("gridlistempty");
                shape.width = this.cellWidth;
                shape.height = this.cellHeight;
                p.Add(shape);
                p.SetTemp("empty", "1");
                p.SetTemp("shape", shape);
                this.emptyList.Add(p);
                this.AddBase(p);
            }
        }
        else if (count < this.emptyList.Count) {
            for (var i = count; i < this.emptyList.Count; i++) {
                if (this.emptyList.Count > 0) {
                    this.emptyList.getItemAt(0).Dispose();
                    //this.emptyList[0].Dispose();
                    this.emptyList.RemoveAt(0);
                }
            }
        }
    };
    NGridList.prototype.LoadPosition = function () {
        var _this = this;
        if (this.disposed) {
            return;
        }
        if (!this.data) {
            return;
        }
        var columnIndex = 0;
        var rowIndex = 0;
        var allCount = Math.max(this.emptyToCount, this.data.Length);
        var index = 0;
        if (this.cellHeight <= 0) {
            var yoffset = 0;
            //TODO:where orderby
            this.sxList.Each(function (fi) {
                if (_this.whereFunc) {
                    if (!_this.whereFunc(fi.GetTemp("list"))) {
                        fi.SetTemp("hide", 1);
                        fi.Hide();
                        fi.Pos(0, -1000);
                        return;
                    }
                }
                fi.Show();
                fi.y = yoffset;
                yoffset += fi.height + _this.margin;
            });
            rowIndex = 1;
        }
        else {
            var list_2 = this.sxList;
            if (this.orderByFunc) {
                var keys = list_2.keys.sort(function (a, b) {
                    try {
                        var lista = list_2[a].GetTemp("list");
                        var listb = list_2[b].GetTemp("list");
                        // if (lista == NGridList.empty) {
                        //     return -1;//TODO:
                        // }
                        // if (listb == NGridList.empty) {
                        //     return 1;//TODO:
                        // }
                        return _this.orderByFunc(lista) - _this.orderByFunc(listb);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                    return 0;
                });
                keys.forEach((function (k) {
                    var fi = list_2[k];
                    if (_this.PutOne(fi, columnIndex, rowIndex)) {
                        if (_this.column <= 0 || columnIndex < _this.column - 1) {
                            columnIndex++;
                        }
                        else {
                            columnIndex = 0;
                            rowIndex++;
                        }
                        index++;
                    }
                }).bind(this));
            }
            else {
                list_2.Each(function (fi) {
                    if (_this.PutOne(fi, columnIndex, rowIndex)) {
                        if (_this.column <= 0 || columnIndex < _this.column - 1) {
                            columnIndex++;
                        }
                        else {
                            columnIndex = 0;
                            rowIndex++;
                        }
                        index++;
                    }
                });
            }
            if (this.emptyList) {
                this.emptyList.Each(function (fi) {
                    if (_this.PutOne(fi, columnIndex, rowIndex)) {
                        if (!_this.freeStyle) {
                            if (_this.animation) {
                                fi.To(columnIndex * _this.cellWidth + columnIndex * _this.margin, rowIndex * _this.cellHeight);
                            }
                            else {
                                fi.Pos(columnIndex * _this.cellWidth + columnIndex * _this.margin, rowIndex * _this.cellHeight);
                            }
                        }
                        if (_this.column <= 0 || columnIndex < _this.column - 1) {
                            columnIndex++;
                        }
                        else {
                            columnIndex = 0;
                            rowIndex++;
                        }
                        index++;
                    }
                });
            }
        }
        this.rowCount = rowIndex;
        if (this.sxList) {
            if (this.sxList.Count(function (fi) { return fi.visible; }) == 0) {
                if (this.defaultFunc) {
                    if (!this.defaultPanel) {
                        this.defaultPanel = new Sx();
                        this.defaultFunc(this.defaultPanel);
                        this.AddBase(this.defaultPanel);
                    }
                    this.defaultPanel.Show();
                }
            }
            else {
                if (this.defaultPanel) {
                    this.defaultPanel.Hide();
                }
            }
        }
        // Form.LazyCall(() => {
        //     this.scroller.viewport.scrollV = 0;
        //     this.HandleScrollHide();
        // });
    };
    NGridList.prototype.PutOne = function (p, columnIndex, rowIndex) {
        if (this.whereFunc) {
            var list = p.GetTemp("list");
            if (list && !this.whereFunc(list)) {
                p.SetTemp("hide", 1);
                p.Hide();
                p.Pos(0, -1000);
                return false;
            }
        }
        p.Show();
        if (!this.freeStyle) {
            if (this.animation) {
                p.To(columnIndex * this.cellWidth + columnIndex * this.margin, rowIndex * this.cellHeight);
            }
            else {
                p.Pos(columnIndex * this.cellWidth + columnIndex * this.margin, rowIndex * this.cellHeight);
            }
        }
        this.LoadOne(p);
        return true;
    };
    NGridList.prototype.LoadOne = function (p) {
        if (p.GetTemp("hide") == 1) {
            p.Hide();
            return;
        }
        if (!p.isLoaded) {
            //Js.Trace(p.globalX + ":" + p.globalY + ":" + this.x + ":" + this.y + ":" + this.w + ":" + this.h);
            if (this.freeStyle || !this.autoHide || this.column <= 0 && this.visibleInScrollH(p, this.cellWidth) || this.column > 0 && this.visibleInScrollV(p, this.cellHeight)) {
                var list = p.GetTemp("list");
                p.isLoaded = true;
                if (list) {
                    try {
                        this.func(p, list);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                }
                else {
                    try {
                        this.func(p, NGridList.empty);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                }
                //let shape = p.GetTemp("shape");//触发范围需要自己去写了
                //shape.width = p.width;
                //shape.height = p.height;
            }
        }
        else {
            if (this.freeStyle || !this.autoHide || this.column <= 0 && this.visibleInScrollH(p, this.cellWidth) || this.column > 0 && this.visibleInScrollV(p, this.cellHeight)) {
                p.Show();
            }
            else {
                p.Hide();
            }
        }
    };
    Object.defineProperty(NGridList.prototype, "width", {
        get: function () {
            return this.w;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NGridList.prototype, "height", {
        get: function () {
            return this.h;
        },
        enumerable: true,
        configurable: true
    });
    NGridList.prototype.Dispose = function () {
        this.disposed = true;
        this.sxList.Clear();
        this.sxList = null;
        this.emptyList.Clear();
        this.emptyList = null;
        if (this.data) {
            this.data.OnAddSplice(this.OnAdd);
            this.data.OnRemoveSplice(this.OnRemove);
        }
        this.data = null;
        this.OnAdd = null;
        this.OnRemove = null;
        if (this.baseChildren) {
            this.baseChildren.Each(function (fi) {
                if (fi.autoDispose) {
                    fi.Dispose();
                }
                else {
                    fi.ui.SetParent(NForm.stage);
                    fi.ui.gameObject.SetActive(false);
                }
            });
            this.baseChildren.Clear();
            this.baseChildren = null;
        }
        _super.prototype.Dispose.call(this);
    };
    NGridList.empty = new Listx();
    return NGridList;
}(NScrollPanel));
__reflect(NGridList.prototype, "NGridList");
window["NGridList"] = NGridList;
// class NGridListLine extends Sx {
//     public cellWidth: number;
//     public cellHeight: number;
//     public cellAct: Function;
//     public data: XmlLinqT;
//     public p: any;
//     public sc: eui.Scroller;
//     public constructor(cellWidth: number,cellHeight: number,data: XmlLinqT,cellAct: Function,line: number = 1,canSelect: boolean = false) {
//         //canSelect TODO;
//         super();
//         this.data = data;
//         this.cellAct = cellAct;
//         this.cellWidth = cellWidth;
//         this.cellHeight = cellHeight;
//         this.width = cellWidth;
//         this.height = cellHeight * line;
//         if(canSelect) {
//             this.p = new eui.List();
//         } else {
//             this.p = new eui.DataGroup();
//         }
//         this.p.itemRendererSkinName = null;
//         this.p.useVirtualLayout = true;
//         this.p.itemRenderer = NGridListRender;
//         this.sc = new eui.Scroller();
//         this.sc.width = cellWidth;
//         this.sc.height = cellHeight * line;
//         this.sc.viewport = this.p;
//         this.sc.scrollPolicyH = eui.ScrollPolicy.OFF;
//         this.Add(this.sc);
//         this.p.dataProvider = this.data._names;
//     }
// } 
var NGridListPageSide = (function (_super) {
    __extends(NGridListPageSide, _super);
    function NGridListPageSide(w, h, column, pageSize, emptyToCount) {
        if (emptyToCount === void 0) { emptyToCount = 0; }
        var _this = _super.call(this) || this;
        _this.column = 1;
        _this.pageSize = 1;
        _this.page = -1;
        _this.column = column;
        _this.pageSize = pageSize;
        _this.w = w;
        _this.h = h;
        _this.g = new NGridList(w, h, column, emptyToCount);
        _this.g.DisableScroll();
        _this.g.DisableMask();
        _this.Add(_this.g);
        var left = new NSButton("page1");
        _this.Add(left, -10 - left.width, (h - left.height) * 4 / 9);
        left.Click(function () {
            _this.SetPage(_this.page - 1);
        });
        var right = new NSButton("page2");
        _this.Add(right, w + 10, (h - right.height) * 4 / 9);
        right.Click(function () {
            var newPage = _this.page + 1;
            if (_this.canSetPageFunc) {
                if (_this.canSetPageFunc(newPage)) {
                    _this.SetPage(_this.page + 1);
                }
            }
            else {
                _this.SetPage(_this.page + 1);
            }
        });
        return _this;
    }
    NGridListPageSide.prototype.SetData = function (xqt, cellHeight, func, margin) {
        var _this = this;
        if (margin === void 0) { margin = 0; }
        this.data = new Array();
        if (this.orderByFunc) {
            var keys = xqt.keys.sort(function (a, b) {
                try {
                    var lista = xqt[a];
                    var listb = xqt[b];
                    return _this.orderByFunc(lista) - _this.orderByFunc(listb);
                }
                catch (ex) {
                    Js.Trace(ex);
                }
                return 0;
            });
            keys.forEach((function (k) {
                var list = xqt[k];
                _this.data.push(list);
            }).bind(this));
        }
        else {
            xqt.Each(function (fi) {
                _this.data.push(fi);
            });
        }
        this.g.orderByFunc = this.orderByFunc;
        this.xqt = xqt;
        this.func = func;
        this.cellHeight = cellHeight;
        this.margin = margin;
    };
    NGridListPageSide.prototype.SetPage = function (page) {
        page = Math.max(page, 0);
        page = Math.min(page, this.xqt.GetPageSize(this.pageSize) - 1);
        if (this.page != page) {
            this.page = page;
            //let data = this.xqt.GetPage(this.pageSize, page);
            var data = this.GetPageData(page);
            this.g.SetData(data, this.cellHeight, this.func, false, this.margin);
        }
    };
    NGridListPageSide.prototype.GetPageData = function (page) {
        page = Math.max(page, 0);
        page = Math.min(page, this.xqt.GetPageSize(this.pageSize) - 1);
        var data = new XmlLinqT();
        for (var i = page * this.pageSize, len = (page + 1) * this.pageSize; i < len; i++) {
            if (this.data.length > i) {
                data.Add(this.data[i]);
            }
        }
        return data;
    };
    NGridListPageSide.prototype.Reload = function () {
        this.page = -1;
        this.SetPage(0);
    };
    return NGridListPageSide;
}(Sx));
__reflect(NGridListPageSide.prototype, "NGridListPageSide");
window["NGridListPageSide"] = NGridListPageSide;
// class NGridListRender extends eui.ItemRenderer {
//     private bg: Sx;
//     private p: Sx;
//     public constructor() {
//         super();
//         this.bg = new Sx();
//         this.addChild(this.bg);
//         this.p = new Sx();
//         this.addChild(this.p);
//     }
//     protected dataChanged(): void {
//         this.p.RemoveAll();
//         this.p.Add(new NLabel(this.data));
//     }
// } 
// class NHardPanel extends Sx {
//     public p: Sx;
//     public sc: eui.Scroller;
//     public constructor(width: number = 1,height: number = 1) {
//         super();
//         this.p = new Sx();
//         this.sc = new eui.Scroller();
//         this.sc.width = width;
//         this.sc.height = height;
//         this.sc.viewport = this.p;
//         this.Add(this.sc);
//     }
//     public Add(s: any,x: number = 0,y: number = 0): boolean {
//         var that=this;
//         if(this.p == null || this.p == s || egret.is(s,"eui.Scroller")) {
//             return super.Add(s,x,y);
//         } else {
//             this.p.Add(s,x,y);
//         }
//         return true;
//     }
// }
var NKLabel = (function (_super) {
    __extends(NKLabel, _super);
    function NKLabel(key, val, keyType, color, bold, size) {
        if (key === void 0) { key = ""; }
        if (val === void 0) { val = ""; }
        if (keyType === void 0) { keyType = 17; }
        if (color === void 0) { color = -1; }
        if (bold === void 0) { bold = false; }
        if (size === void 0) { size = -1; }
        var _this = _super.call(this, val, color, bold, size) || this;
        _this.keyType = keyType;
        _this.key = key;
        return _this;
    }
    return NKLabel;
}(NLabel));
__reflect(NKLabel.prototype, "NKLabel");
window["NKLabel"] = NKLabel;
var NMouseTail3 = (function (_super) {
    __extends(NMouseTail3, _super);
    function NMouseTail3() {
        var _this = _super.call(this) || this;
        _this.frameRage = 25;
        _this.maxLen = 16;
        _this.lenPerFrame = 2;
        _this.scaleOffset = 1;
        _this.tails = [];
        _this.poss = [];
        _this.prePos = null;
        _this.pos = { x: 0, y: 0 };
        _this.Hide();
        _this.y = NForm.stageHeightOffset / 2;
        for (var i = 0; i < _this.maxLen - 1; i++) {
            var img = Assert.Img("tail");
            _this.tails.push(img);
            _this.Add(img, -100, -100);
        }
        NForm.Move(function (ev) {
            _this.pos = { x: ev.stageX, y: ev.stageY };
        }, _this);
        NForm.Up(function (ev) {
            _this.Hide();
            _this.tails.forEach(function (fi) {
                fi.Pos(-100, -100);
            });
        }, _this);
        NForm.Down(function (ev) {
            NForm.LazyCall(function () {
                if (_this.parent.visible) {
                    _this.poss.length = 0;
                    _this.pos = { x: ev.stageX, y: ev.stageY };
                    _this.prePos = _this.pos;
                    _this.Show();
                }
            });
        }, _this);
        NForm.SetInterval(_this.frameRage, function () {
            if (_this.visible) {
                try {
                    var c = _this.lenPerFrame;
                    for (var i_1 = 0; i_1 < c; i_1++) {
                        var p = { x: (_this.pos.x - _this.prePos.x) * i_1 / c + _this.prePos.x, y: (_this.pos.y - _this.prePos.y) * i_1 / c + _this.prePos.y };
                        _this.poss.push(p);
                    }
                    _this.prePos = _this.pos;
                    if (_this.poss.length > _this.maxLen) {
                        _this.poss.splice(0, _this.lenPerFrame);
                    }
                }
                catch (ex) {
                    Js.Trace(ex);
                }
                try {
                    if (_this.poss.length > 2) {
                        var p = _this.poss[_this.poss.length - 1];
                        var prep = p;
                        var scale = 10;
                        var allc = _this.poss.length - 2;
                        var sc = allc * 3 / 4;
                        for (var i_2 = _this.poss.length - 2; i_2 >= 0; i_2--) {
                            p = _this.poss[i_2];
                            if (i_2 >= sc) {
                                scale += _this.scaleOffset;
                            }
                            else {
                                scale -= _this.scaleOffset - 0.15;
                            }
                            var img = _this.tails[i_2];
                            var height = Math.pow((p.x - prep.x) * (p.x - prep.x) + (p.y - prep.y) * (p.y - prep.y), 0.5);
                            img.height = height + 3;
                            img.scaleX = scale / 15;
                            img.Pos(p.x, p.y);
                            if (prep.x != p.x || prep.y != p.y) {
                                var angle = _this.GetAngle(prep.x, prep.y, p.x, p.y);
                                img.rotation = angle;
                            }
                            else {
                                img.rotation = 0;
                            }
                            prep = p;
                        }
                    }
                }
                catch (ex) {
                    Js.Trace(ex);
                }
            }
            return _this.disposed;
        });
        _this.mouseEnabled = false;
        _this.mouseChildren = false;
        return _this;
    }
    NMouseTail3.prototype.GetAngle = function (px, py, mx, my) {
        var x = Math.abs(px - mx);
        var y = Math.abs(py - my);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos); //用反三角函数求弧度
        var angle = Math.floor(180 / (Math.PI / radina)); //将弧度转换成角度
        if (mx > px && my > py) {
            angle = 180 - angle;
        }
        if (mx == px && my > py) {
            angle = 180;
        }
        if (mx > px && my == py) {
            angle = 90;
        }
        if (mx < px && my > py) {
            angle = 180 + angle;
        }
        if (mx < px && my == py) {
            angle = 270;
        }
        if (mx < px && my < py) {
            angle = 360 - angle;
        }
        return angle;
    };
    return NMouseTail3;
}(Sx));
__reflect(NMouseTail3.prototype, "NMouseTail3");
window["NMouseTail3"] = NMouseTail3;
//一个对象在一个视野里面移动，如：世界地图的拖动
var NMovePanel = (function (_super) {
    __extends(NMovePanel, _super);
    function NMovePanel(width, height, moveFunc, movedFunc, bgType, moveWidth, moveHeight) {
        if (width === void 0) { width = 1; }
        if (height === void 0) { height = 1; }
        if (moveFunc === void 0) { moveFunc = null; }
        if (movedFunc === void 0) { movedFunc = null; }
        if (bgType === void 0) { bgType = -1; }
        if (moveWidth === void 0) { moveWidth = -1; }
        if (moveHeight === void 0) { moveHeight = -1; }
        var _this = _super.call(this, width, height, 0) || this;
        _this._disableScroll = false;
        _this.tween = false;
        _this.bounces = false;
        if (width == NForm.width && height == NForm.height) {
            NForm.Resize(function () {
                _this.Resize(width, height);
                _this.Adjust();
            }, _this);
        }
        _this.Resize(width, height);
        _this.moveFunc = moveFunc;
        _this.movedFunc = movedFunc;
        if (moveFunc) {
            _this.scroller.addEventListener(eui.UIEvent.CHANGE, moveFunc, _this.scroller);
        }
        if (movedFunc) {
            _this.scroller.addEventListener(eui.UIEvent.CHANGE_END, movedFunc, _this.scroller);
        }
        return _this;
    }
    NMovePanel.prototype.Resize = function (width, height) {
        _super.prototype.Resize.call(this, width, height);
        this.SetRect(new Rectangle(0, 0, width, height));
        this.Adjust();
    };
    NMovePanel.prototype.Add = function (item, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (this.disposed) {
            return;
        }
        _super.prototype.Add.call(this, item, x, y);
        this.Adjust();
        return true;
    };
    NMovePanel.prototype.Remove = function (item) {
        _super.prototype.Remove.call(this, item);
        this.Adjust();
    };
    NMovePanel.prototype.Adjust = function () {
        if (!this.disposed) {
            //this.move.Adjust();
        }
    };
    NMovePanel.prototype.MoveTo = function (x, y) {
        this.scrollH = x;
        this.scrollV = y;
    };
    Object.defineProperty(NMovePanel.prototype, "contentX", {
        get: function () {
            return this.scroller.viewport.scrollH;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NMovePanel.prototype, "contentY", {
        get: function () {
            return this.scroller.viewport.scrollV;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NMovePanel.prototype, "scrollH", {
        set: function (H) {
            this.scroller.viewport.scrollH = H;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NMovePanel.prototype, "scrollV", {
        set: function (V) {
            this.scroller.viewport.scrollV = V;
        },
        enumerable: true,
        configurable: true
    });
    NMovePanel.prototype.RemoveAll = function () {
        // if (this.move) {
        //     this.move.RemoveAll();
        // }
    };
    Object.defineProperty(NMovePanel.prototype, "contentWidth", {
        get: function () {
            // if (this.move) {
            //     this.move.__width = -1;
            //     return this.move.width;
            // }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NMovePanel.prototype, "contentHeight", {
        get: function () {
            // if (this.move) {
            //     this.move.__height = -1;
            //     return this.move.height;
            // }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    NMovePanel.prototype.SetRect = function (rect) {
        if (rect === void 0) { rect = null; }
        // if (this.move) {
        //     this.move.SetRect(rect);
        // }
    };
    NMovePanel.prototype.DisableScroll = function () {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this._disableScroll = true;
    };
    NMovePanel.prototype.DisableScrollX = function () {
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    };
    NMovePanel.prototype.DisableScrollY = function () {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
    };
    NMovePanel.prototype.EnableScroll = function () {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.AUTO;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.AUTO;
    };
    NMovePanel.prototype.EnableScrollX = function () {
        this.scroller.scrollPolicyH = eui.ScrollPolicy.AUTO;
    };
    NMovePanel.prototype.EnableScrollY = function () {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.AUTO;
    };
    NMovePanel.prototype.Lock = function () {
        this.DisableScroll();
    };
    NMovePanel.prototype.UnLock = function () {
        this.EnableScroll();
    };
    NMovePanel.prototype.Dispose = function () {
        if (this.moveFunc) {
            this.scroller.addEventListener(eui.UIEvent.CHANGE, this.moveFunc, this.scroller);
        }
        if (this.movedFunc) {
            this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this.movedFunc, this.scroller);
        }
        _super.prototype.Dispose.call(this);
        this.movedFunc = null;
        this.view = null;
        //this.move = null;
    };
    return NMovePanel;
}(NScrollPanel));
__reflect(NMovePanel.prototype, "NMovePanel");
window["NMovePanel"] = NMovePanel;
var NNoPage = (function () {
    function NNoPage(g) {
        var _this = this;
        this.max = 0;
        this.page = 0;
        this.inPaging = false;
        this.g = g;
        if (g._disableScroll) {
            throw new Error("NGridList need sed _disableScroll=true");
        }
        var reset = true;
        this.g.OnScrollerEnd(function (ev) {
            var scrollV = ev.scrollV;
            if (_this.g.disposed) {
                return;
            }
            //if (!this.inPaging) {
            if (scrollV < -5 || scrollV > 5) {
                if (reset) {
                    reset = false;
                    if (ev.scrollV < 0) {
                        if (_this.page > 0) {
                            _this.page--;
                            _this.inPaging = true;
                            _this.func(_this.page);
                        }
                    }
                    else if (ev.scrollV > 0) {
                        if (_this.page < _this.max - 1) {
                            _this.page++;
                            _this.inPaging = true;
                            _this.func(_this.page);
                        }
                    }
                }
            }
            else {
                reset = true;
            }
            //Js.Trace(ev.scrollV);
            //}
        });
        this.page1 = Assert.Img("comboboxdown");
        this.page1.align = 1;
        this.page2 = Assert.Img("comboboxdown");
        this.page2.align = 1;
        this.page1.scaleY = -1;
        this.g.Add(this.page1, this.g.w / 2, this.page1.height);
        this.g.Add(this.page2, this.g.w / 2, this.g.h - this.page2.height);
        g.OnDispose(function () {
            _this.g = null;
            _this.func = null;
            _this.page1.Dispose();
            _this.page2.Dispose();
            _this.page1 = null;
            _this.page2 = null;
        });
    }
    NNoPage.prototype.Set = function (page, max, func) {
        var _this = this;
        this.func = func;
        if (page >= 0) {
            this.page = page;
        }
        this.max = max;
        if (page <= 0) {
            this.page1.Hide();
        }
        else {
            this.page1.Show();
        }
        if (page >= max - 1) {
            this.page2.Hide();
        }
        else {
            this.page2.Show();
        }
        NForm.SetTimeout(1000, function () {
            _this.inPaging = false;
        });
    };
    return NNoPage;
}());
__reflect(NNoPage.prototype, "NNoPage");
window["NNoPage"] = NNoPage;
var NNum = (function (_super) {
    __extends(NNum, _super);
    function NNum(num, type, verification, offset) {
        if (type === void 0) { type = "z"; }
        if (verification === void 0) { verification = false; }
        if (offset === void 0) { offset = 0; }
        var _this = _super.call(this) || this;
        _this.type = "z";
        _this.offset = offset + NNum.extraOffset;
        _this.type = type;
        _this.Set(num, type, verification);
        return _this;
    }
    NNum.prototype.Set = function (num, type, verification) {
        if (type === void 0) { type = "z"; }
        if (verification === void 0) { verification = false; }
        num = num.toString();
        this.num = num;
        this.RemoveAll();
        this.type = type;
        this.leftOffset = 0;
        try {
            if (num == null) {
                num = "";
            }
            for (var i = 0, len = num.length; i < len; i++) {
                var char = num.charAt(i);
                if (char == " ") {
                    this.leftOffset += 5;
                }
                else {
                    if (char == "-") {
                        char = "j";
                    }
                    else if (char == "+") {
                        char = "i"; //i
                    }
                    else if (char == "/") {
                        char = "p"; //h
                    }
                    else if (char == ".") {
                        char = "d";
                    }
                    else if (char == ":") {
                        char = "m";
                    }
                    try {
                        var bx = new Bx(type + char);
                        bx.x = this.leftOffset;
                        this.leftOffset += bx.width + this.offset;
                        this.Add(bx);
                        if (verification) {
                            bx.rotation = Strx.Rnd(40) - 20;
                        }
                    }
                    catch (ex) {
                        Js.Trace("Error Num:" + type + char + " orig: " + num);
                    }
                }
            }
            //super.width=left+3;
        }
        catch (ex) {
            Js.Trace("Error Num:" + num);
        }
        if (this.align == 1) {
            this.PutCenter();
        }
        else if (this.align == 2) {
            this.PutRight();
        }
    };
    Object.defineProperty(NNum.prototype, "val", {
        get: function () {
            return this.num;
        },
        set: function (val) {
            this.Set(val, this.type);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NNum.prototype, "valNum", {
        get: function () {
            return this.num.ToInt();
        },
        set: function (val) {
            this.Set(val.toString(), this.type);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NNum.prototype, "width", {
        get: function () {
            return this.leftOffset;
        },
        enumerable: true,
        configurable: true
    });
    NNum.extraOffset = 0;
    return NNum;
}(Sx));
__reflect(NNum.prototype, "NNum");
window["NNum"] = NNum;
var NPanel = (function (_super) {
    __extends(NPanel, _super);
    function NPanel(width, height, bgType) {
        if (width === void 0) { width = 1; }
        if (height === void 0) { height = 1; }
        if (bgType === void 0) { bgType = -1; }
        var _this = _super.call(this) || this;
        _this.visiableInStage = true;
        _this.showBG = bgType > -1;
        if (_this.showBG) {
            if (NPanel.bgFunc) {
                _this.bg = NPanel.bgFunc(bgType);
                _this.bg.OnLoaded((function () {
                    _this.bg.width = width;
                    _this.bg.height = height;
                }).bind(_this));
                var bgp = new Sx();
                bgp.base = true;
                bgp.Add(_this.bg);
                _this.Add(bgp);
            }
        }
        _this.w = width;
        _this.h = height;
        return _this;
    }
    NPanel.prototype.Resize = function (width, height) {
        if (this.showBG && this.bg) {
            this.bg.width = width;
            this.bg.height = height;
        }
        this.w = width;
        this.h = height;
    };
    Object.defineProperty(NPanel.prototype, "width", {
        get: function () {
            if (this.showBG) {
                return this.w;
            }
            else {
                return _super.prototype.Width.call(this);
            }
        },
        set: function (val) {
            this.w = val;
            if (this.showBG) {
                this.bg.width = val;
            }
            else {
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NPanel.prototype, "height", {
        get: function () {
            if (this.showBG) {
                return this.h;
            }
            else {
                return _super.prototype.Height.call(this);
            }
        },
        set: function (val) {
            if (this.showBG) {
                this.h = val;
                this.bg.height = val;
            }
            else {
            }
        },
        enumerable: true,
        configurable: true
    });
    NPanel.prototype.InShow = function () {
        this.visiableInStage = true;
        for (var i = 0; i < this.numChildren; i++) {
            var item = this.getChildAt(i);
            if (item instanceof NPanel) {
                item.InShow();
            }
            if (item instanceof NSButton) {
                item.Show();
            }
            if (item instanceof NProcess) {
                item.Show();
            }
            if (item instanceof Bx) {
                item.Show();
            }
        }
    };
    NPanel.prototype.InHide = function () {
        this.visiableInStage = false;
        for (var i = 0; i < this.numChildren; i++) {
            var item = this.getChildAt(i);
            if (item instanceof NPanel) {
                item.InHide();
            }
            else if (item instanceof NSButton) {
                item.Hide();
            }
            else if (item instanceof NProcess) {
                item.Hide();
            }
            else if (item instanceof Bx) {
                item.Hide();
            }
        }
    };
    NPanel.prototype.Show = function () {
        this.InShow();
        _super.prototype.Show.call(this);
    };
    NPanel.prototype.Hide = function () {
        this.InHide();
        _super.prototype.Hide.call(this);
    };
    NPanel.prototype.Add = function (s1, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (s1 == null) {
            return false;
        }
        var s = null;
        if (typeof s1 == "string") {
            s = Assert.Img(s1);
        }
        else {
            s = s1;
        }
        if (!this.disposed) {
            if (s.hasOwnProperty("hasReLoad")) {
                if (s.hasOwnProperty("loaded")) {
                    if (s["loaded"]) {
                    }
                    else {
                        s.Reload();
                        s["loaded"] = true;
                    }
                }
            }
        }
        ///////////////////////////////////
        var rv = _super.prototype.Add.call(this, s, x, y);
        if (s instanceof NPanel) {
            //(item as NPanel).OnAdd();
        }
        return rv;
    };
    return NPanel;
}(Sx));
__reflect(NPanel.prototype, "NPanel");
window["NPanel"] = NPanel;
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
var NProcess = (function (_super) {
    __extends(NProcess, _super);
    function NProcess(fg, bg, l, width, scroll, processFunc, isheight) {
        if (bg === void 0) { bg = null; }
        if (l === void 0) { l = null; }
        if (width === void 0) { width = -1; }
        if (scroll === void 0) { scroll = false; }
        if (processFunc === void 0) { processFunc = null; }
        if (isheight === void 0) { isheight = false; }
        var _this = _super.call(this) || this;
        _this._val = 0;
        _this.fgWidth = 0;
        _this.fgHeight = 0;
        _this.tweenTime = 100;
        _this.scrollType = 0;
        _this.isheight = isheight;
        if (l == null) {
            l = new NLabel("", 0xffffff, false, 20);
        }
        else {
            if (l.val == "") {
                l.val = " ";
            }
        }
        if (typeof fg == "string") {
            fg = Assert.Img(fg);
            _this._fgName = fg;
        }
        if (typeof bg == "string") {
            bg = Assert.Img(bg);
        }
        _this._bg = bg;
        _this.l = l;
        _this.scroll = scroll;
        _this.fgWidth = fg.width;
        _this.fgHeight = fg.height;
        _this.processFunc = processFunc;
        if (width <= 0) {
            if (bg) {
                _this._width = bg.width;
                _this._height = bg.height;
            }
            else {
                _this._width = fg.width;
                _this._height = fg.height;
            }
        }
        else {
            if (isheight) {
                _this._height = width;
                if (bg) {
                    bg.height = width;
                }
                fg.height = width;
            }
            else {
                _this._width = width;
                if (bg) {
                    bg.width = width;
                }
                fg.width = width;
            }
        }
        if (bg) {
            _this.Add(bg);
        }
        _this.pFg = new Sx();
        _this.Add(_this.pFg);
        _this.fg = fg;
        _this.SetVal(0);
        l.align = 1;
        _this.Add(l, _this._width / 2, (fg.height - l.height) / 2);
        return _this;
    }
    Object.defineProperty(NProcess.prototype, "fgName", {
        set: function (val) {
            if (this._fgName != val) {
                this._fgName = val;
                this.fg = Assert.Img(val);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NProcess.prototype, "fg", {
        get: function () {
            return this._fg;
        },
        set: function (val) {
            this._fg = val;
            this.pFg.RemoveAll();
            this.pFg.Add(this._fg);
            if (this.scroll) {
                if (!this.scrollDis) {
                    var shape = new egret.Shape();
                    shape.graphics.beginFill(0x000000, 1);
                    shape.graphics.drawRect(0, 0, val.width, val.height);
                    shape.graphics.endFill();
                    this.Add(shape);
                    this._fg.mask = shape;
                    this.scrollDis = shape;
                }
                //this._fg.scrollRect = new Rectangle(0, 0, this.fgWidth, this._fg.height);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NProcess.prototype, "val", {
        get: function () {
            return this._val;
        },
        set: function (val) {
            this.SetVal(val);
            this._val = val;
        },
        enumerable: true,
        configurable: true
    });
    NProcess.prototype.SetVal = function (val, tweenTime) {
        if (val === void 0) { val = 100; }
        if (tweenTime === void 0) { tweenTime = 0; }
        if (this.disposed) {
            return;
        }
        if (tweenTime > 0) {
            ActLite.To(this, { val: val }, tweenTime, function () { });
            return;
        }
        if (val > 100) {
            val = 100;
        }
        val = val.ToInt();
        if (val <= 0) {
            if (this.scrollDis && this.isheight) {
                ActLite.To(this.scrollDis, { scaleY: 0 }, 500);
            }
            this.fg.Hide();
            //(<egret.DisplayObject><any>this.fg).alpha = 0;
            return;
        }
        else {
            this.fg.Show();
            //(<egret.DisplayObject><any>this.fg).alpha = 1;
        }
        this._val = val;
        try {
            if (val < 0) {
                val = 0;
            }
            if (this.scroll) {
                if (this.height > 0) {
                    if (this.scrollType == 1) {
                        this.scrollDis.scaleY = val / 100;
                        this.scrollDis.y = this.height * (100 - val) / 100;
                    }
                    else {
                        //this.scrollDis.scaleX = val / 100;
                        this.fg.scrollRect = new Rectangle(0, 0, this._width * val / 100, this.height);
                    }
                    //this.fg.mask = this.scrollDis;
                }
                if (this.processFunc) {
                    this.processFunc();
                }
            }
            else {
                this.fg.width = this._width * val / 100;
                if (this.processFunc) {
                    this.processFunc();
                }
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
    };
    NProcess.prototype.SetText = function (val) {
        this.l.val = val;
    };
    Object.defineProperty(NProcess.prototype, "width", {
        get: function () {
            if (this._fg instanceof NSprite) {
                if (this._bg && this._bg.$bitmapData) {
                    return this._bg.$bitmapData.width;
                }
                if (this._fg.$bitmapData) {
                    return this._fg.$bitmapData.width;
                }
            }
            else {
                if (this._bg) {
                    return this._bg.width;
                }
                return this._fg.width;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NProcess.prototype, "height", {
        get: function () {
            if (this._fg instanceof NSprite) {
                if (this._bg && this._bg.$bitmapData) {
                    return this._bg.$bitmapData.height;
                }
                if (this._fg.$bitmapData) {
                    return this._fg.$bitmapData.height;
                }
            }
            else {
                if (this._bg) {
                    return this._bg.height;
                }
                return this._fg.height;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    NProcess.textStyle = 201;
    return NProcess;
}(Sx));
__reflect(NProcess.prototype, "NProcess");
window["NProcess"] = NProcess;
var NPs = (function (_super) {
    __extends(NPs, _super);
    //private factory: egret.MovieClipDataFactory;
    //public ani: egret.MovieClip;
    //public playTimes: number;
    //public overAndRemove: boolean;
    //public playEndFunc: Function;
    //public movieData: egret.MovieClipData
    function NPs(path) {
        return _super.call(this) || this;
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
    NPs.prototype.Play = function (name, playEndFunc) {
        if (playEndFunc === void 0) { playEndFunc = null; }
    };
    NPs.prototype.Stop = function () {
        // if (this.ani) {
        //     this.ani.stop();
        // }
    };
    NPs.prototype.StopAtEnd = function () {
        // this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
        // this.ani.addEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
    };
    NPs.prototype.StopAtEndWhenPlayOnEnd = function () {
        // if (this.ani) {
        //     this.ani.gotoAndStop(this.ani.totalFrames - 1);
        // }
        // this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
    };
    NPs.prototype.Continue = function () {
        // if (this.ani) {
        //     this.ani.play();
        // }
    };
    NPs.prototype.End = function (ev) {
        // if (this.overAndRemove) {
        //     this.Dispose();
        // }
    };
    NPs.prototype.PlayOnEnd = function (ev) {
        // if (this.playEndFunc) {
        //     this.playEndFunc();
        // }
    };
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
    NPs.prototype.Dispose = function () {
        if (!this.disposed) {
            // this.ani.stop();
            // this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.PlayOnEnd, this);
            // this.ani.removeEventListener(egret.Event.COMPLETE, this.End, this);
            // this.ani.removeEventListener(egret.Event.LOOP_COMPLETE, this.StopAtEndWhenPlayOnEnd, this);
            // this.ani.movieClipData = null;
        }
        //this.movieData = null;
        _super.prototype.Dispose.call(this);
    };
    return NPs;
}(Sx));
__reflect(NPs.prototype, "NPs");
window["NPs"] = NPs;
var NRadio = (function (_super) {
    __extends(NRadio, _super);
    function NRadio(data, w, h, act, onChanged, columnCount, mode) {
        if (act === void 0) { act = null; }
        if (onChanged === void 0) { onChanged = null; }
        if (columnCount === void 0) { columnCount = 9999; }
        if (mode === void 0) { mode = 0; }
        var _this = _super.call(this) || this;
        _this.mode = 0;
        _this.checkList = new Listx();
        _this.data = data;
        _this.act = act;
        _this.onChanged = onChanged;
        _this.rowCount = columnCount;
        _this.mode = mode;
        _this.w = w;
        _this.h = h;
        for (var i = 0; i < data.length; i++) {
            _this.AddCheck(data[i], w, h, i);
        }
        _this.selectIndex = 0;
        return _this;
    }
    NRadio.prototype.AddCheck = function (val, width, height, i) {
        var _this = this;
        var check = new NCheck(val, width, height, this.act);
        var x = 0;
        var y = 0;
        if (this.mode == 0) {
            x = width * (i % this.rowCount);
            y = height * (Math.floor(i.ToInt() / this.rowCount));
        }
        this.Add(check, x, y);
        this.checkList.s(val, check);
        check.check = false;
        check.Click(function () {
            _this.selectIndex = i;
        });
    };
    Object.defineProperty(NRadio.prototype, "selectIndex", {
        get: function () {
            return this._selectIndex;
        },
        set: function (val) {
            var _this = this;
            if (this.checkedCheck) {
                this.checkedCheck.check = false;
            }
            this.checkedCheck = this.checkList.GetValue(val);
            this.checkedCheck.check = true;
            this._selectIndex = val;
            if (this.onChanged) {
                NForm.LazyCall(function () {
                    _this.onChanged(val);
                });
            }
            this.PutPos();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NRadio.prototype, "selectItem", {
        get: function () {
            return this.checkList.GetValue(this._selectIndex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NRadio.prototype, "select", {
        get: function () {
            return this.data[this.selectIndex];
        },
        set: function (val) {
            for (var i = 0, len = this.data.length; i < len; i++) {
                if (this.data[i] == val) {
                    this.selectIndex = i;
                    this.PutPos();
                    return;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    NRadio.prototype.PutPos = function () {
        var check;
        var i;
        var len;
        if (this.mode == 1) {
            //for (i = 0, len = this.selectIndex; i < len; i++) {
            //    check: = this.checkList.GetValue(i);
            //    check.depth = -Math.abs(this.selectIndex - i);
            //    var x: number = this._width / 3 * ((i - this.selectIndex) % this.rowCount) - this._width * 2 / 3;
            //    check.To({ x: x }, 200);
            //    var matrix: Matrix3D = new Matrix3D(Vector.<Number>([
            //        1, 0, 0.4, 0,
            //        0, 1, 0, 0,
            //        0, 0, 1, 0,
            //        0, 0, 0, 1]));
            //}
            //check = this.checkList.GetValue(this.selectIndex);
            //check.depth = 999;
            //check.To({ x: 0 }, 200);
            //matrix = new Matrix3D(Vector.<Number>([
            //    1, 0, 0, 0,
            //    0, 1, 0, 0,
            //    0, 0, 1, 0,
            //    0, 0, 0, 1]));
            //for (i = this.selectIndex + 1, len = this.checkList.Length; i < len; i++) {
            //    check = this.checkList.GetValue(i);
            //    check.depth = -Math.abs(this.selectIndex - i);
            //    x = this._width / 3 * ((i - this.selectIndex) % this.rowCount) + this._width * 4 / 5;
            //    check.To({ x: x }, 200);
            //    matrix = new Matrix3D(Vector.<Number>([
            //        0.25, 0, -0.4, 0,
            //        0, 0.85, 0, 0,
            //        0, 0, 1, 0,
            //        0, 30, 0, 1]));
            //}
        }
        else if (this.mode == 2) {
            for (var j = 0, len1 = this.selectIndex; j < len1; j++) {
                check = this.checkList.GetValue(j);
                check.depth = -Math.abs(this.selectIndex - j);
                var x1 = this.w / 3 * (10 % this.rowCount) + this.w;
                check.To({ x: x1 }, 200);
                check.scaleX = 0.7;
                check.scaleY = 0.7;
            }
            check = this.checkList.GetValue(this.selectIndex);
            check.depth = 999;
            check.To({ x: 0 }, 200);
            check.scaleX = 1;
            check.scaleY = 1;
            for (i = this.selectIndex + 1, len = this.checkList.Length; i < len; i++) {
                check = this.checkList.GetValue(i);
                check.depth = -Math.abs(this.selectIndex - i);
                x1 = this.w / 3 * ((i - this.selectIndex) % this.rowCount) + this.w * 2 / 3;
                check.To({ x: x1 }, 200);
                check.scaleX = 0.7;
                check.scaleY = 0.7;
            }
        }
    };
    NRadio.Ani = function (ico) {
        if (this.aniIco == ico) {
            return;
        }
        if (this.aniIco) {
            this.aniIco.filters = null;
        }
        if (this.aniIco != ico) {
            this.aniIco = ico;
            //this.aniIco.filters = Filters.highLightFilter;
            this.DoAni(this.aniIco);
        }
    };
    NRadio.DoAni = function (ico) {
        var _this = this;
        if (!ico.topVisible) {
            return;
        }
        if (this.aniIco != ico) {
            ico.To({ y: 0 }, 500);
            return;
        }
        ico.To({ y: 10 }, 500, function () {
            if (_this.aniIco != ico) {
                ico.To({ y: 0 }, 500);
                return;
            }
            ico.To({ y: -10 }, 500, function () {
                _this.DoAni(ico);
            });
        });
    };
    return NRadio;
}(Sx));
__reflect(NRadio.prototype, "NRadio");
window["NRadio"] = NRadio;
var NSButton = (function (_super) {
    __extends(NSButton, _super);
    function NSButton(b, bOn, music, highLight, filterDoubleClickTime) {
        if (bOn === void 0) { bOn = null; }
        if (music === void 0) { music = null; }
        if (highLight === void 0) { highLight = true; }
        if (filterDoubleClickTime === void 0) { filterDoubleClickTime = -1; }
        var _this = _super.call(this) || this;
        _this.music = null;
        _this.filterDoubleClickTime = -1;
        _this._filterDoubleClick = false;
        _this.b = b;
        _this.bOn = bOn;
        if (music == null) {
            music = NSButton.musicBG;
        }
        _this.music = music;
        _this.filterDoubleClickTime = filterDoubleClickTime;
        if (typeof b == "string") {
            b = Assert.Img(b);
            var load_1 = new egret.Shape();
            load_1.graphics.beginFill(0x000000, 0);
            load_1.graphics.drawRect(0, 0, 100, 40);
            load_1.graphics.endFill();
            _this.Add(load_1);
            b.OnLoaded((function () {
                _this.RemoveDisplayObject(load_1);
            }).bind(_this));
        }
        if (typeof bOn == "string") {
            bOn = Assert.Img(bOn);
        }
        if (b instanceof Bx) {
            b.OnLoaded(function () {
                if ((b.width <= 50 || b.height <= 50)) {
                    if (b.width <= 50 && b.height <= 50) {
                        _this.SetHitArea(new Rectangle(-16, -12, b.width + 32, b.height + 24), false);
                    }
                    else if (b.width <= 50) {
                        _this.SetHitArea(new Rectangle(-16, -12, b.width + 32, b.height), false);
                    }
                    else {
                        _this.SetHitArea(new Rectangle(-16, -12, b.width, b.height + 24), false);
                    }
                }
            });
        }
        if (bOn) {
            bOn.Hide();
            _this.Add(bOn);
        }
        _this.Add(b);
        _this.obj = b;
        _this.buttonMode = true;
        if (highLight) {
            if (bOn) {
                _this.Down(function () {
                    bOn.Show();
                    b.alpha = 0;
                });
                _this.OutAndUp(function () {
                    bOn.Hide();
                    b.alpha = 1;
                });
                _this.Up(function () {
                    bOn.Hide();
                    b.alpha = 1;
                });
            }
            else {
                _this.Down(function () {
                    b.filters = Filters.highLightFilter;
                });
                _this.OutAndUp(function () {
                    b.filters = null;
                });
                _this.Up(function () {
                    b.filters = null;
                });
            }
        }
        var that = _this;
        if (filterDoubleClickTime > 0) {
            _this.Click(function (ev) {
                if (filterDoubleClickTime > 0) {
                    if (!_this._filterDoubleClick) {
                        _this._filterDoubleClick = true;
                        _this.filters = Filters.grayFilter;
                        NForm.SetTimeout(filterDoubleClickTime, function () {
                            _this.filters = null;
                            _this._filterDoubleClick = false;
                        });
                    }
                    else {
                        ev.stopImmediatePropagation();
                    }
                }
            });
        }
        if (Strx.IsFull(music)) {
            _this.Click(function () {
                if (Strx.IsFull(music)) {
                    Music.Play(music);
                }
            });
        }
        _this.ResetWidthHeight();
        return _this;
    }
    NSButton.prototype.Dispose = function () {
        this.obj = null;
        _super.prototype.Dispose.call(this);
    };
    Object.defineProperty(NSButton.prototype, "width", {
        get: function () {
            if (this.obj && this.obj instanceof N9) {
                return this.obj.width;
            }
            else if (_super.prototype.Width.call(this) > 0) {
                return _super.prototype.Width.call(this);
            }
            else if (this.obj && this.obj.width > 0) {
                return this.obj.width;
            }
            return _super.prototype.Width.call(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NSButton.prototype, "height", {
        get: function () {
            if (this.obj && this.obj instanceof N9) {
                return this.obj.height;
            }
            else if (_super.prototype.Height.call(this) > 0) {
                return _super.prototype.Height.call(this);
            }
            else if (this.obj && this.obj.height > 0) {
                return this.obj.height;
            }
            return _super.prototype.Height.call(this);
        },
        enumerable: true,
        configurable: true
    });
    NSButton.prototype.On = function () {
        if (this.bOn) {
            this.b.Hide();
            this.bOn.Show();
        }
    };
    NSButton.prototype.Off = function () {
        if (this.bOn) {
            this.b.Show();
            this.bOn.Hide();
        }
    };
    NSButton.musicBG = null;
    return NSButton;
}(Sx));
__reflect(NSButton.prototype, "NSButton");
window["NSButton"] = NSButton;
//手机上用NNoPage
// class NSimplePage extends Sx {
//     public _val: number;
//     private func: Function;
//     private min: number = 1;
//     private max: number;
//     private text: NText;
//     private page: number;
//     private numNct: NColorText;
//     public constructor() {
//         super();
//         var bg: NPanel = new NPanel(86, 34, 4);
//         bg.alpha = 0.5;
//         this.Add(bg, 112);
//         this.numNct = new NColorText("", false, 15);
//         this.numNct.align = 1;
//         this.Add(this.numNct, 155, 9);
//         var a: NSButton = new NSButton("pagel1");
//         this.Add(a, 60, 0);
//         a.Click(() => {
//             if (this.page > this.min) {
//                 this.val = this.page;
//                 this.func(this.val - 1);
//                 this.page = this.val;
//             }
//         });
//         var b: NSButton = new NSButton("pager1");
//         this.Add(b, 210, 0);
//         b.Click(() => {
//             if (this.page < this.max) {
//                 this.val = this.page;
//                 this.func(this.val + 1);
//                 this.page = this.val;
//             }
//         });
//         var c: NSButton = new NSButton("pagel0");
//         this.Add(c);
//         c.Click(() => {
//             this.val = 1;
//             this.func(this.val);
//             this.page = this.val;
//         });
//         var d: NSButton = new NSButton("pager0");
//         this.Add(d, 270, 0);
//         d.Click(() => {
//             this.val = this.max;
//             this.func(this.val);
//             this.page = this.val;
//         });
//         this.val = this.min;
//     }
//     public set val(_val: number) {
//         if (_val < this.min) {
//             _val = this.min;
//         }
//         if (_val > this.max) {
//             _val = this.max;
//         }
//         this._val = _val;
//         this.numNct.val = "第" + _val + "页";
//     }
//     public get val(): number {
//         return this._val;
//     }
//     public SetMin(min: number) {
//         this.min = min;
//         this.val = this.val;
//     }
//     public SetMax(max: number) {
//         this.max = max;
//         this.val = this.val;
//     }
//     public Set(page: number, total: number, func: Function) {
//         Js.Trace("page:" + page);
//         this.func = func;
//         this.max = total
//         this.SetMax(total);
//         this.val = page;
//         this.page = page;
//         this.numNct.val = "第" + page + "页";
//     }
// }
var NSprite = (function (_super) {
    __extends(NSprite, _super);
    function NSprite(path, width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this, null) || this;
        _this.loadedFunc = function () {
            if (width > 0) {
                _this.width = width;
            }
            else {
                if (_this.width <= 0) {
                    _this.width = _this.$bitmapWidth;
                }
            }
            if (height > 0) {
                _this.height = height;
            }
            else {
                if (_this.height <= 0) {
                    _this.height = _this.$bitmapHeight;
                }
            }
            if (_this.align == 1) {
                _this.PutCenter();
            }
            else if (_this.align == 2) {
                _this.PutRight();
            }
        };
        if (path.length >= 4 && (path.StartWith(Config.src) || path.StartWith("http"))) {
            _this.SetBitmap(path);
        }
        else {
            _this.SetBitmap(RES.getRes(path));
        }
        return _this;
    }
    return NSprite;
}(Bx));
__reflect(NSprite.prototype, "NSprite");
window["NSprite"] = NSprite;
var NTabPanel = (function (_super) {
    __extends(NTabPanel, _super);
    function NTabPanel(w, h, buttonStyle, OnTabChange, mode, panelType) {
        if (buttonStyle === void 0) { buttonStyle = 10; }
        if (OnTabChange === void 0) { OnTabChange = null; }
        if (mode === void 0) { mode = 0; }
        if (panelType === void 0) { panelType = -9999; }
        var _this = _super.call(this) || this;
        _this.list = new Listx();
        _this.bList = new Listx();
        _this._offset = 0;
        if (panelType == -9999) {
            panelType = NTabPanel.defaultPanelType;
        }
        _this.mode = mode;
        _this.w = w;
        _this.h = h;
        _this.style = buttonStyle;
        _this.OnTabChange = OnTabChange;
        _this.panelType = panelType;
        _this.tempButton = new NButton("", buttonStyle);
        _this.tempButton.Hide();
        _this.Add(_this.tempButton);
        var offsetY = 1;
        offsetY = 4;
        if (mode == 1) {
            var allP1 = new NScrollPanel(_this.w, _this.h + 32);
            _this.Add(allP1);
            _this.allP = new Sx();
            allP1.Add(_this.allP);
            allP1.Pos(0, offsetY);
        }
        else {
            _this.allP = new Sx();
            _this.Add(_this.allP, 0, 31 + offsetY);
        }
        _this.tabPanel = new NPanel(w, _this.tempButton.height - 10);
        _this.tabPanel.Pos(0, offsetY - (_this.tempButton.height - 31));
        _this.Add(_this.tabPanel);
        _this.midPanel = new NPanel(w, _this.tempButton.height - 10);
        _this.tabPanel.Add(_this.midPanel);
        return _this;
    }
    NTabPanel.prototype.AddTab = function (key, offset, type) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        if (type === void 0) { type = 0; }
        this._offset += offset;
        if (this.list.Length == 0) {
            this.selectKey = key;
            if (offset != 0) {
            }
        }
        var b = new NButton(key, this.style);
        b.b.music = "";
        this.tabPanel.Add(b);
        b.Click((function () {
            Music.Play("tab");
            _this.SelectKey(key);
        }).bind(this));
        if (type == 0) {
            b.Pos(25 + this.list.Length * (this.tempButton.width + 6) + this._offset, 0);
        }
        else if (type == 2) {
            b.Pos(this.w, 60 + this.list.Length * (this.tempButton.height + 6) + this._offset);
        }
        else {
            b.Pos(-this.tempButton.width, 60 + this.list.Length * (this.tempButton.height + 6) + this._offset);
        }
        this.bList[key] = b;
        var p = new NPanel(this.w, this.h, this.panelType);
        p.Hide();
        this.allP.Add(p);
        this.list[key] = p;
        this.LoadXY();
        return p;
    };
    NTabPanel.prototype.AddTabPro = function (key, func, tabFunc, offset, type) {
        if (tabFunc === void 0) { tabFunc = null; }
        if (offset === void 0) { offset = 0; }
        if (type === void 0) { type = 0; }
        if (this.proList == null) {
            this.proList = new Listx();
        }
        if (this.proFuncList == null) {
            this.proFuncList = new Listx();
        }
        if (this.tabFuncList == null) {
            this.tabFuncList = new Listx();
        }
        var p = this.AddTab(key, offset, type);
        this.proList[key] = p;
        this.proFuncList[key] = func;
        if (tabFunc) {
            this.tabFuncList[key] = tabFunc;
        }
        this.selectKey = "";
    };
    NTabPanel.PutPosition = function (x, y, xOffset, yOffset, items) {
        for (var i = 0; i < items.length; i++) {
            if (items[i] != null) {
                items[i].x = x + xOffset * i;
                items[i].y = y + yOffset * i;
            }
        }
    };
    NTabPanel.prototype.LoadXY = function () {
        if (this.mode == 1) {
            var arr_1 = [];
            this.list.Each(function (fi) {
                arr_1.push(fi);
            });
            NTabPanel.PutPosition(0, 32, this.w, 0, arr_1);
        }
    };
    NTabPanel.prototype.Select = function (index) {
        this.SelectKey(this.list.GetName(index));
    };
    Object.defineProperty(NTabPanel.prototype, "selectIndex", {
        get: function () {
            var index = this.list.GetIndex(this.selectKey);
            return index.Max(0);
        },
        enumerable: true,
        configurable: true
    });
    NTabPanel.prototype.SelectKey = function (key) {
        var _this = this;
        if (!this.list.Exists(key)) {
            return;
        }
        var willEvent = false;
        if (this.selectKey != key) {
            willEvent = true;
        }
        var willNotOpen = false;
        if (this.proList && this.proList.Exists(key)) {
            if (this.proList[key].loaded) {
            }
            else {
                willNotOpen = this.proFuncList[key](this.proList[key]);
                if (!willNotOpen) {
                    this.proList[key].loaded = true;
                }
            }
        }
        if (!willNotOpen) {
            this.selectKey = key;
            if (this.mode == 0) {
                this.list.Each(function (fi) {
                    fi.Hide();
                });
                this.list[key].Show();
            }
            this.bList.Each(function (fi) {
                fi.Off();
            });
            if (this.mode == 0) {
                this.list[key].Show();
            }
            if (this.mode == 1) {
                var index_3 = 0;
                this.list.EachKey(function (fi) {
                    if (fi == key) {
                        ActLite.To(_this.allP, { x: -index_3 * _this.w }, 400);
                        return true;
                    }
                    index_3++;
                });
            }
            this.bList[key].On();
        }
        if (!willNotOpen) {
            if (willEvent) {
                if (this.OnTabChange) {
                    NForm.LazyCall(function () {
                        _this.OnTabChange(_this.list.GetIndex(key));
                    });
                }
                if (this.tabFuncList) {
                    if (this.tabFuncList.Exists(key)) {
                        NForm.LazyCall(function () {
                            _this.tabFuncList[key]();
                        });
                    }
                }
            }
        }
    };
    NTabPanel.defaultPanelType = 11;
    return NTabPanel;
}(Sx));
__reflect(NTabPanel.prototype, "NTabPanel");
window["NTabPanel"] = NTabPanel;
var NText = (function (_super) {
    __extends(NText, _super);
    function NText(key, val, maxSize, w, h, func, completeFunc, fontSize) {
        if (h === void 0) { h = -1; }
        if (func === void 0) { func = null; }
        if (completeFunc === void 0) { completeFunc = null; }
        if (fontSize === void 0) { fontSize = 20; }
        var _this = _super.call(this) || this;
        _this._key = key;
        _this.func = func;
        _this.completeFunc = completeFunc;
        if (h < 40) {
            h = 40;
        }
        _this.w = w;
        _this.h = h;
        _this.bg = NText.bgRender();
        _this.bg.width = w + 10;
        _this.bg.height = h;
        _this.Add(_this.bg);
        _this.textFieldp = new Sx();
        _this.Add(_this.textFieldp);
        _this.textField = new egret.TextField();
        _this.textField.type = egret.TextFieldType.INPUT;
        _this.textField.width = w;
        _this.textField.height = h;
        _this.textField.size = fontSize;
        _this.textField.maxChars = maxSize;
        _this.textField.textColor = NText.color;
        _this.textFieldp.Add(_this.textField, 0, (h - fontSize) / 4); //new NColorText("", false, 15, 17);
        if (func) {
            _this.textField.addEventListener(egret.TextEvent.CHANGE, func, _this);
            _this.textField.addEventListener(egret.Event.CHANGE, func, _this);
        }
        if (completeFunc) {
            _this.textField.addEventListener(egret.TextEvent.FOCUS_OUT, completeFunc, _this);
            _this.textField.addEventListener(egret.Event.FOCUS_OUT, completeFunc, _this);
        }
        _this.textField.addEventListener(egret.TextEvent.FOCUS_IN, function () {
            Msg.Call("TextFieldFocusIn", null);
        }, _this);
        _this.textField.addEventListener(egret.Event.FOCUS_IN, function () {
            Msg.Call("TextFieldFocusIn", null);
        }, _this);
        _this.textField.addEventListener(egret.TextEvent.FOCUS_OUT, function () {
            Msg.Call("TextFieldFocusOut", null);
        }, _this);
        _this.textField.addEventListener(egret.Event.FOCUS_OUT, function () {
            Msg.Call("TextFieldFocusOut", null);
        }, _this);
        if (Strx.IsFull(_this._key)) {
            if (NColorText.ExsistStyle(0)) {
                _this.keyTextField = new NColorText(Lang.PT(_this._key) + "：", true, fontSize, 0);
            }
            else {
                _this.keyTextField = new NLabel(Lang.PT(_this._key) + "：", 0xffffff, true, fontSize);
            }
            _this.keyTextField.y = (h - fontSize) / 2 - 1;
            _this.Add(_this.keyTextField);
        }
        _this.val = val;
        _this.OnPos(function () {
            _this.SetTextFieldPos();
        });
        _this.addEventListenerSx(egret.Event.ADDED_TO_STAGE, _this.SetTextFieldPos);
        return _this;
    }
    NText.prototype.SetTextFieldPos = function (ev) {
        var _this = this;
        if (ev === void 0) { ev = null; }
        if (this.parent) {
            NForm.LazyCall((function () {
                if (!_this.disposed) {
                    var keyWidth = 0;
                    if (_this.keyTextField) {
                        keyWidth = _this.keyTextField.width;
                    }
                    _this.bg.x = keyWidth + 8;
                    _this.bg.y = -4;
                    _this.textFieldp.x = keyWidth + 16;
                    _this.textFieldp.y = 3;
                }
            }).bind(this));
        }
    };
    Object.defineProperty(NText.prototype, "val", {
        get: function () {
            return this.textField.text;
        },
        set: function (val) {
            if (val == null) {
                val = "";
            }
            this._val = val;
            this.textField.text = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NText.prototype, "multiline", {
        get: function () {
            return this.textField.multiline;
        },
        set: function (val) {
            this.textField.multiline = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NText.prototype, "isPassword", {
        set: function (val) {
            this.textField.displayAsPassword = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NText.prototype, "holdPlace", {
        set: function (val) {
            if (this.holdPlaceLabel == null) {
                this.holdPlaceLabel = new NLabel("", 0xaaaaaa, false, this.textField.size - 2);
                this.holdPlaceLabel.alpha = 0.3;
                this.textFieldp.Add(this.holdPlaceLabel, this.textField.x + 1, (this.h - this.holdPlaceLabel.height) / 2 - 2);
                if (this.val.IsFull()) {
                    this.holdPlaceLabel.Hide();
                }
                this.textField.addEventListener(egret.TextEvent.CHANGE, this.HandleHoldPlace, this);
                this.textField.addEventListener(egret.Event.CHANGE, this.HandleHoldPlace, this);
            }
            this.holdPlaceLabel.val = val;
        },
        enumerable: true,
        configurable: true
    });
    NText.prototype.HandleHoldPlace = function (ev) {
        if (this.val.IsFull()) {
            this.holdPlaceLabel.Hide();
        }
        else {
            this.holdPlaceLabel.Show();
        }
    };
    NText.prototype.Dispose = function () {
        if (this.func) {
            this.textField.removeEventListener(egret.TextEvent.CHANGE, this.func, this);
            this.textField.removeEventListener(egret.Event.CHANGE, this.func, this);
        }
        if (this.completeFunc) {
            this.textField.removeEventListener(egret.TextEvent.FOCUS_OUT, this.completeFunc, this);
            this.textField.removeEventListener(egret.Event.FOCUS_OUT, this.completeFunc, this);
        }
        this.textField.removeEventListener(egret.TextEvent.CHANGE, this.HandleHoldPlace, this);
        this.textField.removeEventListener(egret.Event.CHANGE, this.HandleHoldPlace, this);
        this.func = null;
        this.completeFunc = null;
        _super.prototype.Dispose.call(this);
    };
    NText.color = 0x000000;
    return NText;
}(Sx));
__reflect(NText.prototype, "NText");
window["NText"] = NText;
// class NTileMap extends Sx {
//     private tileWidth: number = 200;
//     private tileHeight: number = 200;
//     private id: string;
//     private showBlackBg: boolean;
//     private mapWidth: number;
//     private mapHeight: number;
//     private textureBlockIndex: number = 0;
//     private textureBlockIndexCheck: number = 0;
//     private textureBlock;
//     private info: Listx;
//     public constructor(id: string, mapWidth: number, mapHeight: number, showBlackBg: boolean = false) {
//         super();
//         this.id = id;
//         this.showBlackBg = showBlackBg;
//         this.mapWidth = mapWidth;
//         this.mapHeight = mapHeight;
//         this.info = new Listx();
//         //if(!Parms.starling){
//         this.textureBlock = Assert.Img("" + id + ".jpg", mapWidth, mapHeight);
//         this.Add(this.textureBlock);
//         //}
//         Form.LazyCall(this.Update.bind(this));
//     }
//     public Update(x: number = 0, y: number = 0) {
//         Form.LazyCall(() => {
//             this.DoUpdate(x, y);
//         });
//     }
//     public DoUpdate(x: number = 0, y: number = 0) {
//         if (x == 0 && y == 0) {
//             return;
//         }
//         if (x == 0) {
//             x = -this.globalX;
//         }
//         if (y == 0) {
//             y = -this.globalY;
//         }
//         var added: boolean = false;
//         var jMin: number = Math.floor(1.0 * y / this.tileHeight);
//         var jMax: number = Math.ceil(1.0 * (y + NForm.height) / this.tileHeight);
//         var iMin: number = Math.floor(1.0 * x / this.tileWidth);
//         var iMax: number = Math.ceil(1.0 * (x + NForm.width) / this.tileWidth);
//         for (var j: number = 0, jlen: number = Math.ceil(this.mapHeight / this.tileHeight); j < jlen; j++) {
//             for (var i: number = 0, ilen: number = Math.ceil(this.mapWidth / this.tileWidth); i < ilen; i++) {
//                 if (j >= jMin && j < jMax &&
//                     i >= iMin && i < iMax) {
//                     if (!this.info.Exists(j + "_" + i)) {
//                         this.AddBG(this.id, j, i);
//                         added = true;
//                     } else {
//                         if (!this.info[j + "_" + i].parent) {
//                             this.Add(this.info[j + "_" + i]);
//                         }
//                     }
//                 } else {
//                     if (this.info.Exists(j + "_" + i) && this.info[j + "_" + i].parent) {
//                         this.info[j + "_" + i].RemoveMe();
//                     }
//                 }
//             }
//         }
//         if (added) {
//             //SetChildrenMouseEnabled();
//         }
//     }
//     private AddBG(id: string, j: number, i: number): void {
//         if (this.textureBlock ) {
//             this.textureBlock.Show();
//         }
//         this.textureBlockIndexCheck++;
//         var s = Assert.Img(id + "/" + j + "_" + i + ".jpg");
//         s.OnLoaded(() => {
//             //sp.DrawImg(s.bx,i*tileWidth,j*tileHeight);
//             this.textureBlockIndex++;
//             if (this.textureBlockIndex >= this.textureBlockIndexCheck) {
//                 if (this.textureBlock ) {
//                     this.textureBlock.Hide();
//                 }
//             }
//         });
//         this.Add(s, i * this.tileWidth, j * this.tileHeight);
//         s.autoDispose = false;
//         this.info[j + "_" + i] = s;
//     }
// } 
var SocketHttp = (function () {
    function SocketHttp() {
    }
    return SocketHttp;
}());
__reflect(SocketHttp.prototype, "SocketHttp");
window["SocketHttp"] = SocketHttp;
var SocketLocal = (function () {
    function SocketLocal() {
    }
    return SocketLocal;
}());
__reflect(SocketLocal.prototype, "SocketLocal");
window["SocketLocal"] = SocketLocal;
var SocketTcp = (function () {
    function SocketTcp() {
    }
    return SocketTcp;
}());
__reflect(SocketTcp.prototype, "SocketTcp");
window["SocketTcp"] = SocketTcp;
var SocketWs = (function (_super) {
    __extends(SocketWs, _super);
    function SocketWs(sender, ip, port) {
        var _this = _super.call(this) || this;
        _this.sender = sender;
        _this.ip = ip;
        _this.port = port;
        _this.socket = new egret.WebSocket();
        //this.socket.type = egret.WebSocket.TYPE_BINARY;
        _this.socket.addEventListener(egret.Event.CONNECT, _this.ConnectHandler, _this);
        _this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, _this.DataHandler, _this);
        _this.socket.addEventListener(egret.Event.CLOSE, _this.CloseHandler, _this);
        return _this;
    }
    SocketWs.prototype.Connect = function () {
        if (Config.wss == 1) {
            this.socket.connectByUrl("wss://" + this.ip + ":" + this.port);
        }
        else {
            this.socket.connect(this.ip, this.port);
        }
    };
    SocketWs.prototype.Send = function (text, errFunc) {
        if (errFunc === void 0) { errFunc = null; }
        if (this.socket.connected) {
            this.socket.writeUTF(text);
            this.socket.flush();
        }
    };
    SocketWs.prototype.SendGBK = function (text) {
        //        if(this.socket.connected) {
        //            this.socket.writeMultiByte(text,"GBK");
        //            this.socket.flush();
        //        }
    };
    SocketWs.prototype.Close = function () {
        this.socket.close();
    };
    SocketWs.prototype.ConnectHandler = function (ev) {
        var event = new egret.Event(egret.Event.CONNECT);
        this.dispatchEvent(event);
    };
    SocketWs.prototype.DataHandler = function (ev) {
        try {
            if (SocketWs.net && SocketWs.net.socket && ev.target == SocketWs.net.socket.socket) {
                if (this.socket.connected) {
                    var text = this.socket.readUTF();
                    if (text.length > 0) {
                        if (text.indexOf("$") == -1) {
                            var buffer = Strx.Decompress(new Uint8Array(egret.Base64Util.decode(text)));
                            text = UTF8.decode(buffer);
                        }
                        this.sender(text);
                    }
                }
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
    };
    SocketWs.prototype.CloseHandler = function (ev) {
        var event = new egret.Event(egret.Event.CLOSE);
        this.dispatchEvent(event);
    };
    Object.defineProperty(SocketWs.prototype, "isConnected", {
        get: function () {
            return this.socket.connected;
        },
        enumerable: true,
        configurable: true
    });
    return SocketWs;
}(egret.EventDispatcher));
__reflect(SocketWs.prototype, "SocketWs", ["ISocket"]);
window["SocketWs"] = SocketWs;
