declare class Dictionary extends egret.HashObject {
    private static systemKeys;
    _xml: any;
    private _gsKey;
    private _risingChanged;
    constructor();
    CreateGSS(keys: any): void;
    CreateGS(key: string): void;
    s(key: string, val: any): void;
    Set(key: any, val: any): void;
    g(key: string): any;
    Get(key: string): any;
    Remove(key: string): void;
    Clear(): void;
    Exists(key: string): boolean;
    GetOrAdd(key: string, func: Function): any;
    GetName(index: number): string;
    GetValue(index: number): any;
    GetIndex(key: string): number;
    EachKey(func: Function): void;
    Each(func: Function): void;
    ResetLength(): void;
    private _length;
    readonly length: number;
    readonly Length: number;
    readonly keys: Array<string>;
    Dispose(): void;
    _changedFuncList: Arr<Function>;
    readonly changedFuncList: Arr<Function>;
    Changed(key: string, oldValue: any, newValue: any): void;
}
declare class Sx extends eui.Group implements Ix {
    that: this;
    showTop50: boolean;
    base: boolean;
    isLoaded: boolean;
    guideX: number;
    guideY: number;
    getGuideX: Function;
    getGuideY: Function;
    guidePos: number;
    warn: boolean;
    sxIndex: number;
    showTipWarn: boolean;
    static index: number;
    continueGuide: boolean;
    SetAutoHide(showTop50?: boolean): void;
    constructor();
    private _depth;
    depth: number;
    private _parent;
    HandleAutoHide_Hide(): void;
    HandleAutoHide_Show(): void;
    private static autoHideOffset;
    HandleAutoHide(): boolean;
    Add(s2: any, x?: number, y?: number): boolean;
    LazyAdd(s: any): void;
    Remove(item: Ix): void;
    RemoveDisplayObject(item: egret.DisplayObject): void;
    buttonMode: boolean;
    Dispose(): void;
    IsBG(): void;
    graphicsed: boolean;
    graphics: egret.Shape;
    SetupGraphics(): void;
    DrawRect(x: number, y: number, width: number, height: number, color: number, alpha: number): void;
    DrawRoundRect(x: number, y: number, width: number, height: number, colors: Array<number>, alphas: Array<number>, ellipse: number): void;
    DrawLine(x1: number, y1: number, x2: number, y2: number, lineHeight: number, color: number, alpha: number): void;
    DrawArc(x: number, y: number, radius: number, fromAngle: number, endAngle: number, colors: Array<number>, alphas: Array<number>): void;
    DrawCircle(x: number, y: number, radius: number, colors: Array<number>, alphas: Array<number>): void;
    DrawFan(radius: number, startAngle: number, endAngle: number): void;
    DrawSixth(x: number, y: number, radius: number, borderColor: number, borderHeight: number, borderAlpha: number, colors: Array<number>, alphas: Array<number>): void;
    DrawClear(): void;
    static _clickEvent: egret.TouchEvent;
    static readonly clickEvent: egret.TouchEvent;
    Click(func: Function): void;
    DblClick(func: Function): void;
    Over(func: Function): void;
    OutAndUp(func: Function): void;
    Move(func: Function): void;
    Down(func: Function): void;
    Up(func: Function): void;
    checkEventAlpha: boolean;
    Flatten(): void;
    UnFlatten(): void;
    SetChildrenMouseDisabled(): Sx;
    SetChildrenMouseEnabled(): Sx;
    SetHitArea(rect: egret.Rectangle, show?: boolean, inner?: boolean): Sx;
    autoDispose: boolean;
    private listenerArr;
    addEventListenerSx(type: string, listener: Function, u?: boolean, p?: number, w?: boolean): void;
    removeEventListenerSx(type: string, listener: Function, u?: boolean): void;
    private onlyRemoveEventListener(type, listener, u?);
    clearEventListener(): void;
    readonly globalX: number;
    readonly globalY: number;
    scale: Vector2;
    display: boolean;
    Show(): void;
    Hide(): void;
    _top: any;
    readonly tops: any;
    _x: number;
    x: number;
    SxSetX(val: number): void;
    _y: number;
    y: number;
    SxSetY(val: number): void;
    position: Vector2;
    Pos(x: number, y: number): Ix;
    Scale(x: number, y: number): Ix;
    PutCenter(): void;
    PutRight(): void;
    private OnPosList;
    OnPos(func: Function): void;
    OnPosSplice(func: Function): void;
    RemoveMe(): void;
    readonly topVisible: boolean;
    private onDisposeList;
    OnDispose(func: Function): void;
    private static OnRemove(ev);
    private onShowList;
    OnShow(func: Function): void;
    private onHideList;
    OnHide(func: Function): void;
    OnShowSplice(func: Function): void;
    OnHideSplice(func: Function): void;
    private _visible;
    visible: boolean;
    To(stateTo: any, time?: number, func?: Function, parseHandle?: Function): any;
    ToPath(stateTo: any, func?: Function, parseHandle?: Function): any;
    private OnLoadList;
    CallLoad(): void;
    OnLoaded(func: Function): void;
    private followSx;
    Follow(sx: any, offsetX?: any, offsetY?: any, delay?: number, followDispose?: boolean, followVisible?: boolean): void;
    static _tipFunc: Function;
    static TipFunc: Function;
    Tip(text: any, func?: Function, sprite?: any): void;
    disposed: boolean;
    __width: number;
    Width(): number;
    width: number;
    __height: number;
    Height(): number;
    height: number;
    ResetWidthHeight(): void;
    RemoveAll(): void;
    _mouseChildren: boolean;
    mouseChildren: boolean;
    _mouseEnabled: boolean;
    mouseEnabled: boolean;
    private _align;
    align: number;
    _filters: Array<any>;
    filters: Array<any>;
    private sxInfo;
    GetTemp(key: string): any;
    SetTemp(key: string, val: any): void;
    static RegisterGuideFunc: any;
    RegisterGuide(guide: string, step?: number): void;
}
declare class Observer extends Dictionary {
    constructor();
    g(key: any): any;
    Get(name: any): any;
    setProperty(name: any, value: any): void;
    Dispose(): void;
}
declare class NLabel extends Sx {
    static font: string;
    static defaultColor: number;
    bg: Sx;
    act: Function;
    keyTextField: NColorText;
    textF: egret.TextField;
    private keyNum;
    keyType: number;
    private _color;
    color: number;
    private _bold;
    bold: boolean;
    private _size;
    size: number;
    private _italic;
    italic: boolean;
    item: Listx;
    private _stroke;
    stroke: number;
    private _strokeColor;
    strokeColor: number;
    static fontSize: number;
    static phoneFontSize: number;
    constructor(val?: string, color?: number, bold?: boolean, size?: number, stroke?: number, strokeColor?: number, withBg?: boolean);
    private _key;
    key: string;
    private _val;
    val: string;
    html: string;
    static htmlTextParser: egret.HtmlTextParser;
    private htmlCustom;
    private GetHtml(html);
    private HandleHtmlCustom();
    valInt: number;
    x: number;
    bindKey: string;
    private bindEmptyP;
    Bind(item: Listx, bindKey: string, act?: Function): void;
    OnClick(act: Function): void;
    readonly width: number;
    readonly height: number;
    SetMultiline(width: number, leading?: number): void;
    Dispose(): void;
    private faces;
    SetFaceVal(value: string): void;
    static HtmlAlignCenter(text: string, w: number, fontSize: number): string;
}
declare class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    toString(): string;
    Equals(p: Vector2): boolean;
    Move(x: number, y: number): Vector2;
    Multi(val: number): Vector2;
    Distance(p: Vector2): number;
    static New(x: number, y: number): Vector2;
}
declare class NScrollPanel extends Sx {
    view: Sx;
    scroller: eui.Scroller;
    bg: any;
    private onScrollerEndList;
    w: number;
    h: number;
    updateInterval: number;
    private scrollerEnd;
    constructor(w?: number, h?: number, updateInterval?: number);
    private scrollerEndIndex;
    private ScrollerEnd(ev);
    OnScrollerEnd(func: any): void;
    private ScrollerTouchEnd(ev);
    Add(s1: any, x?: number, y?: number): boolean;
    RemoveAll(): void;
    BaseAdd(s: any, x?: number, y?: number): boolean;
    Resize(w: number, h: number): void;
    _disableScroll: boolean;
    DisableScroll(): void;
    DisableScrollX(): void;
    DisableScrollY(): void;
    EnableScroll(): void;
    EnableScrollX(): void;
    EnableScrollY(): void;
    _disableMask: boolean;
    DisableMask(): void;
    tween: boolean;
    bounces: boolean;
    visibleInScrollV(p: Sx, cellHeight: number): boolean;
    visibleInScrollH(p: Sx, cellWidth: number): boolean;
    Dispose(): void;
}
declare class Bx extends eui.Image implements Ix {
    this: this;
    base: boolean;
    depth: number;
    val: any;
    loaded: boolean;
    loadedFunc: Function;
    loadedFuncList: Arr<Function>;
    constructor(val: any);
    SetVal(val: any): void;
    private InfoChanged(key, oldValue, newValue, insert, obj);
    private static OnRemove(ev);
    SetBitmap(val: any): void;
    bitmapData: any;
    Dispose(): void;
    autoDispose: boolean;
    private listenerArr;
    addEventListenerBx(type: string, listener: Function, u?: boolean, p?: number, w?: boolean): void;
    removeEventListenerBx(type: string, listener: Function, u?: boolean): void;
    private onlyRemoveEventListener(type, listener, u?);
    clearEventListener(): void;
    LocalX(globalX: number): number;
    LocalY(globalY: number): number;
    readonly globalX: number;
    readonly globalY: number;
    scale: Vector2;
    readonly display: boolean;
    Show(): void;
    Hide(): void;
    _top: any;
    readonly tops: any;
    private _x;
    x: number;
    private _y;
    y: number;
    position: Vector2;
    Pos(x: number, y: number): Ix;
    Scale(x: number, y: number): Ix;
    PutCenter(): void;
    PutRight(): void;
    private onPosList;
    OnPos(func: Function): void;
    OnPosSplice(func: Function): void;
    RemoveMe(): void;
    readonly topVisible: boolean;
    private OnDisposeList;
    OnDispose(func: Function): void;
    private onShowList;
    OnShow(func: Function): void;
    private onHideList;
    OnHide(func: Function): void;
    OnShowSplice(func: Function): void;
    OnHideSplice(func: Function): void;
    visible: boolean;
    To(stateTo: any, time?: number, func?: Function, parseHandle?: Function): ActLite;
    ToPath(stateTo: any, func?: Function, parseHandle?: Function): any;
    OnLoaded(func: Function): void;
    private followSx;
    Follow(sx: any, offsetX?: any, offsetY?: any, delay?: number, followDispose?: boolean, followVisible?: boolean): void;
    disposed: boolean;
    _mouseChildren: boolean;
    mouseChildren: boolean;
    _mouseEnabled: boolean;
    mouseEnabled: boolean;
    private _align;
    align: number;
    private _textures;
    textures: Textures;
}
declare class LangType {
    static Chs: string;
    static Cht: string;
    static Jp: string;
    static Test: string;
}
declare class Arr<T> extends eui.ArrayCollection {
    constructor(source?: any[]);
    readonly Count: number;
    readonly Length: number;
    Add(item: T): void;
    Remove(item: T): void;
    RemoveBy(func: Function): void;
    RemoveAt(index: number): void;
    InsertAt(item: T, index: number): void;
    Contian(item: T): boolean;
    Clear(): void;
    Each(func: Function): void;
    EachDesc(func: Function): void;
}
declare class NAniBase extends Sx {
    private overAndRemove;
    private arr;
    img: Bx;
    enterFrame: Function;
    enterFrame1: Function;
    endAct: Function;
    stopAtEnd: boolean;
    constructor(overAndRemove?: boolean);
    private load;
    Load(arr: Arr<any>): void;
    private _frameRate;
    frameRate: number;
    _stop: boolean;
    _stopAtEnd: boolean;
    _timerHandleIndex: number;
    private TimerHandle();
    private origLateFrameList;
    private lateFrameList;
    LateFrame(per?: number, lateCount?: number): void;
    ClearLateFrame(): void;
    times: number;
    private addTime;
    private frameCount;
    private stoped;
    private stopFrame;
    private frames;
    Stop(frame?: number): void;
    Play(frame?: number): void;
    PlayFrames(frames: any, stopFrame?: number): void;
    TimerHandler(): boolean;
    Dispose(): void;
}
interface String {
    ArrList(): Array<Listx>;
    Xqt(): any;
}
declare class Listx extends Observer {
    _staticData: boolean;
    _parent: XmlLinqT;
    constructor();
    static _listenCount: number;
    private static listenCount;
    static listenTraced: boolean;
    private static TraceListen();
    Listen(act: Function, key: string, sx: Ix): void;
    ListenArray(act: Function, keys: Array<any>, sx: Ix): void;
    static GetArrList(text: string): Array<Listx>;
    static GetXmlLinqT(text: string): XmlLinqT;
    static Arr(text: string): Listx;
    static ArrSmart(text: string): Listx;
    static GetArr(text: string): Listx;
    static GetArrSmart(text: string): Listx;
    Text(): string;
    static GetArrText(arr: Array<Listx>): string;
    CopyTo(list: Listx): void;
    GetPageSize(pageSize: number): number;
    Take(size: number, skip?: number): Listx;
    Where(func: Function): Listx;
    Copy(): Listx;
    Count(func?: Function): number;
    Any(func: Function): boolean;
    All(func: Function): boolean;
    FirstOrDefault(func: Function): any;
    Max(func: Function): number;
    Min(func: Function): number;
    MaxItem(func: Function): any;
    toString(): string;
    Dispose(): void;
}
declare class NColorText extends NLabel {
    static arr: Array<any>;
    static arrFilter: Array<any>;
    static arrFilterNoborder: Array<any>;
    static willEmbedFontsFunc: Function;
    static starlingOffsetSize: number;
    constructor(val: string, bold?: boolean, size?: number, style?: number, showBorderFilters?: boolean);
    ValMulti(val: string, width: number, leading?: number): void;
    static ExsistStyle(style: number): boolean;
    style: number;
}
declare class Music {
    private id;
    private sound;
    private channel;
    private loopTimes;
    private loaded;
    private stoped;
    constructor(id: string, loopTimes?: number);
    private Load(id);
    private LoadComplete();
    Play(): void;
    Stop(): void;
    private LoadError();
    private PlayEnd();
    static mList: Listx;
    static Play(id: string): void;
    static Load(id: string): void;
    static _bg: Music;
    static preBgId: string;
    static bgId: string;
    static Bg(id: string): Music;
    static BgStop(): void;
    static _musicBgOn: boolean;
    static musicBgOn: boolean;
    static _musicOn: boolean;
    static musicOn: boolean;
    disposed: boolean;
    Dispose(): void;
}
declare class NForm {
    static NARROW: boolean;
    static WIDE: boolean;
    static stageFg: Sx;
    static stageBg: Sx;
    static moved: boolean;
    static styleSetupLoad: boolean;
    static stage: egret.Stage;
    static main: Sx;
    static top: Sx;
    static middle: Sx;
    static middle1: Sx;
    static overTop: Sx;
    static stageScale: number;
    static stageWidthOffset: number;
    static stageHeightOffset: number;
    static stageX: number;
    static stageY: number;
    static downDt: Date;
    static Load(stage: egret.Stage): void;
    static HideMain(): void;
    static ShowMain(): void;
    static readonly width: number;
    static readonly height: number;
    static TopLeft(dis: Ix, x?: number, y?: number): void;
    static TopLeftExtra(dis: Ix, x?: number, y?: number): void;
    static Top(dis: Ix, x?: number, y?: number): void;
    static TopExtra(dis: Ix, x?: number, y?: number): void;
    static TopRight(dis: Ix, x?: number, y?: number): void;
    static TopRightExtra(dis: Ix, x?: number, y?: number): void;
    static Left(dis: Ix, x?: number, y?: number): void;
    static LeftExtra(dis: Ix, x?: number, y?: number): void;
    static Center(dis: Ix, x?: number, y?: number): void;
    static CenterExtra(dis: Ix, x?: number, y?: number): void;
    static Right(dis: Ix, x?: number, y?: number): void;
    static RightExtra(dis: Ix, x?: number, y?: number): void;
    static BottomLeft(dis: Ix, x?: number, y?: number): void;
    static BottomLeftExtra(dis: Ix, x?: number, y?: number): void;
    static Bottom(dis: Ix, x?: number, y?: number): void;
    static BottomExtra(dis: Ix, x?: number, y?: number): void;
    static BottomRight(dis: Ix, x?: number, y?: number): void;
    static BottomRightExtra(dis: Ix, x?: number, y?: number): void;
    static Full(dis: any, x?: number, y?: number): void;
    static FullAndStageZero(dis: any, x?: number, y?: number): void;
    static FullExtra(dis: Ix, x?: number, y?: number): void;
    static FullWidth(dis: Ix, x?: number): void;
    static FullHeight(dis: Ix, y?: number): void;
    static Click(func: Function, sx: Ix): void;
    static Down(func: Function, sx: Ix): void;
    static Up(func: Function, sx: Ix): void;
    static Move(func: Function, sx: Ix): void;
    static Resize(func: Function, sx: Ix): void;
    private static _mouseXYEvent;
    private static _mouseX;
    static readonly mouseX: number;
    private static _mouseY;
    static readonly mouseY: number;
    static EnterFrame(ev: egret.Event): void;
    private static toList;
    static To(ix: Ix, vec: Vector2, times?: number, act?: Function): void;
    private static toTargetList;
    static ToTarget(ix: Ix, target: Sx, offset: Vector2, times?: number, act?: Function): void;
    private static valuesToList;
    static ValuesTo(begin: number, to: number, times: number, act: Function, end?: Function): void;
    private static setTimeoutList;
    static SetTimeout(time: number, act: (...arg) => void): void;
    private static setIntervalList;
    static SetInterval(time: number, act: (...arg) => void): void;
    static MainThread(act: (...arg) => void): void;
    static LazyCall(act: (...arg) => void): void;
    private static autoHideList;
    static AddHandleAutoHide(sx: Sx): void;
    static HandleAutoHide(): void;
}
declare class Filters {
    static readonly borderFilter: Array<any>;
    static readonly deepBorderFilter: Array<any>;
    static readonly tabBorderFilter: Array<any>;
    static readonly tabBorderFilterOff: Array<any>;
    static readonly borderFilter0: Array<any>;
    static readonly borderFilter1: Array<any>;
    static readonly borderFilter2: Array<any>;
    static readonly borderFilter3: Array<any>;
    static readonly borderFilter4: Array<any>;
    static readonly borderFilter5: Array<any>;
    static readonly greenBorderFilter: Array<any>;
    static readonly borderLightFilter: Array<any>;
    static readonly lightGlowFilter: Array<any>;
    static readonly glowFilter: Array<any>;
    static readonly blackLineFilter: Array<any>;
    static readonly blackLightLineFilter: Array<any>;
    static readonly knockoutGlowFilter: Array<any>;
    static readonly knockoutWhiteGlowFilter: Array<any>;
    static readonly knockoutRedGlowFilter: Array<any>;
    static readonly knockoutGrayFilter: Array<any>;
    static readonly blackFilter: Array<any>;
    static readonly redFilter: Array<any>;
    static readonly grayFilter: Array<any>;
    static readonly lightGrayFilter: Array<any>;
    static readonly brownGlowFilter: Array<any>;
    static readonly greenGlowFilter: Array<any>;
    static readonly redGlowFilter: Array<any>;
    static readonly highLightFilter: Array<any>;
}
declare class IOx {
    static ReadURL(path: string, urlLoaded: Function, urlError?: Function, data?: string, method?: string): void;
    static ReadURLContent(path: string, urlLoaded: Function, urlError?: Function, data?: string): void;
}
interface Ix {
    OnDispose(func: Function): any;
    Dispose(): any;
    Show(): any;
    Hide(): any;
    RemoveMe(): any;
    Pos(x: number, y: number): Ix;
    width: number;
    height: number;
    x: number;
    y: number;
    position: Vector2;
    visible: boolean;
    topVisible: boolean;
    disposed: boolean;
    OnPos(func: Function): any;
}
declare class Js extends egret.HashObject {
    static showTrace: boolean;
    static TraceCmd: Function;
    static TraceCmdDmx: Function;
    static Call(str: string): any;
    static FullScreen(): void;
    static Trace(str: any): void;
    static TraceObj(obj: any): void;
    static TraceDmx(str: any): void;
    private static GetParm(url, method);
    static GetUrlParm(method: string): string;
    static OpenWindow(url: string, target?: string, features?: string): void;
    private static GetBrowserName();
    private static _supportWebGL;
    static readonly SupportWebGL: boolean;
}
declare class Lazy<T> {
    private val;
    constructor(func: Function);
}
declare class ActLite {
    static To(sx: any, stateTo: any, time?: number, onEndFunc?: Function, parseHandle?: Function): any;
    static ToTarget(sx: any, target: any, offsetx: any, offsety: any, time?: number, onEndFunc?: Function): any;
}
declare class AStar {
    private static BLOCK_WAY;
    private static AROUND_POINTS;
    private static COST_DIAGONAL;
    private static COST_STRAIGHT;
    private static NOTE_OPEN;
    private static NOTE_ID;
    private static NOTE_CLOSED;
    private static _instance;
    private static blocks;
    private static _mapWalkDataMaxX;
    private static _mapWalkDataMaxY;
    private static _fatherList;
    private static _noteMap;
    private static _openId;
    private static _nodeList;
    private static _openCount;
    private static _openList;
    private static _pathScoreList;
    private static _movementCostList;
    static maxTry: number;
    static Init(dataList: Vector2Hash): void;
    static Find(p_start: Vector2, p_end: Vector2, isOptimize?: boolean): any;
    private static IncisePath(path);
    private static IsOpen(p);
    private static AheadNote(index);
    private static OpenNote(p, score, cost, fatherId);
    private static Optimize(pointList, fromIndex?);
    private static Optimize2(pointList, fromIndex?);
    private static CloseNote(id);
    private static GetScore(index);
    private static GetArounds(p);
    private static CanPass(p);
    private static GetPath(p_start, id, isOptimize);
    private static InitLists();
    private static IsClosed(p);
    private static DestroyLists();
    private static BackNote();
}
declare class Msg {
    private static list;
    static Call(name: string, val: any): void;
    static Fun(fi: Function, val: any): void;
    static Listen(name: string, act: Function, sx: Ix): void;
}
interface Number {
    ToInt(): number;
    Max(val1: number): number;
    Min(val1: number): number;
    Clamp(min: number, max: number): number;
}
declare class Point extends egret.Point {
    constructor(x: number, y: number);
}
declare class Prototype {
}
declare class Rectangle extends egret.Rectangle {
    constructor(x: number, y: number, width: number, height: number);
}
declare class Server {
    static SetFile(path: string, val: string): void;
    static GetFile(path: string): string;
    static GetIO(path: string): string;
    static SetIO(path: string, val: string): void;
    static GC(): void;
    static CreateClass(c: any): any;
    static readonly Now: DateTime;
}
declare class SHA1 {
    constructor();
    private static _instance;
    static GI(): SHA1;
    private hexcase;
    private b64pad;
    hex_sha1(s: any): string;
    b64_sha1(s: any): string;
    any_sha1(s: any, e: any): string;
    hex_hmac_sha1(k: any, d: any): string;
    b64_hmac_sha1(k: any, d: any): string;
    any_hmac_sha1(k: any, d: any, e: any): string;
    private sha1_vm_test();
    private rstr_sha1(s);
    private rstr_hmac_sha1(key, data);
    private rstr2hex(input);
    private rstr2b64(input);
    private rstr2any(input, encoding);
    private str2rstr_utf8(input);
    private str2rstr_utf16le(input);
    private str2rstr_utf16be(input);
    private rstr2binb(input);
    private binb2rstr(input);
    private binb_sha1(x, len);
    private sha1_ft(t, b, c, d);
    private sha1_kt(t);
    private safe_add(x, y);
    private bit_rol(num, cnt);
}
declare class SingleQueue {
    timeout: number;
    handleQueue: Array<any>;
    private inHandle;
    private index;
    private act;
    private continueCount;
    constructor(act: Function, timeout?: number);
    Push(item: any): void;
    private Add(item);
    private En(item);
    private Handle(item);
    End(): void;
}
declare class Sp extends Bx {
    constructor(val: any);
}
declare class Src {
    static ReadByte(path: string, urlLoaded: Function, errorFunc?: Function): void;
    static dataCacheList: Listx;
    static inreadingDataCacheList: Listx;
    static Read(path: string, urlLoaded: Function): void;
    static textCacheList: Listx;
    static ReadTxt(path: string, urlLoaded: Function, willCache?: boolean): void;
    static ReadXml(path: string, urlLoaded: Function, willCache?: boolean): void;
    static modelFlexList: Listx;
    static Load(func: Function): void;
}
declare class Config {
    static qq: string;
    static qqq: string;
    static allShopGoods: string;
    static urls: Array<string>;
    static gameUrl: string;
    static payUrl: string;
    static shareUrl: string;
    static src: string;
    static showTrace: string;
    static version: number;
    static icoPath: string;
    static srcPath: string;
    static game: string;
    static isLW: boolean;
    static cardMode: boolean;
    static app: string;
    static shareApp: string;
    static serverIp: string;
    static port: number;
    static serverIpTls13: string;
    static portTls13: number;
    static portHttp: number;
    static serverName: string;
    static serverBegin: number;
    static serverFrom: number;
    static test: string;
    static ps: boolean;
    static closeChat: boolean;
    static serverId: string;
    static newServerMode: boolean;
    static wss: number;
    static gonggao: string;
    static isBattleCard: boolean;
    static isStyleCard: boolean;
    static mainCenter: number;
    static btServer: boolean;
    static gameType: number;
    static ads: string;
    static openAds: boolean;
    static banner: string;
    static banner2: string;
    static bannery: number;
    static outAds: boolean;
    static alert: string;
    static alertOld: string;
    static appMode: boolean;
    static inExam: boolean;
    static autoCreateRole: boolean;
    static bbs: string;
    static share: string;
    static readonly shareIco: string;
    static shareIcos: Array<string>;
    static tujian: string;
    static businessType: string;
    static newServerId: string;
    static dic: Listx;
    static LoadConfig(xml: Xml, func: Function): void;
}
declare class TaskQueue {
    private timeout;
    private onIdle;
    constructor(timeout?: number, onIdle?: Function);
    queue: Array<any>;
    private inHandle;
    AddQueue(func: any): void;
    private Handle(func?);
    Next(): void;
    disposed: boolean;
    Dispose(): void;
}
declare class Textures {
    tick: number;
    private texture;
    path: string;
    disposed: boolean;
    constructor(texture: egret.Texture, path?: string);
    readonly bitmapWidth: number;
    readonly bitmapHeight: number;
    readonly bitmapData: egret.BitmapData;
    GetTexture(): egret.Texture;
    UseTexture(bx: Bx): this;
    UnUseTexture(): void;
    Keep(): void;
    Release(): void;
    Dispose(): void;
    static texturesStatic: Listx;
    static textures: Listx;
    static GetTextures(texture: egret.Texture, path?: string): Textures;
    static GC(): void;
    static DoGC(path: string): void;
}
declare class Time {
    constructor();
    static ParseTime(val: string): Date;
    static ParseString(val: Date): string;
    static ParseStringWithMilliseconds(val: Date): string;
    static GetTimeSpan(seconds: number): string;
    static readonly Now: DateTime;
}
declare class TimeSpan {
    private tick;
    constructor(tick: number);
    readonly TotalDay: number;
    readonly TotalHour: number;
    readonly TotalMinutes: number;
    readonly TotalSeconds: number;
    readonly TotalMilliseconds: number;
}
declare class UTF8 {
    static encode(str: string): Uint8Array;
    static decode(data: Uint8Array): string;
    private EOF_byte;
    private EOF_code_point;
    private encoderError(code_point);
    private decoderError(fatal, opt_code_point?);
    private inRange(a, min, max);
    private div(n, d);
    private stringToCodePoints(string);
    private encode(str);
    private decode(data);
}
declare class Caches {
    private static dic;
    static GetDic(key: string): any;
    static GetListx(key: string): Listx;
    static GetArr(key: string): any;
    static GetObj(key: string): any;
    static SetObj(key: string, obj: any): void;
}
declare class Vector2Hash {
    v: any;
    width: number;
    height: number;
    constructor(width: number, height: number, data?: string);
    Set(x: number, y: number): void;
    Delete(x: number, y: number): void;
    Exists(x: number, y: number): boolean;
    ExistsPoint(p: Vector2): boolean;
    Clear(): void;
    readonly length: number;
}
declare class Xml {
    nodes: any[];
    keys: {};
    constructor(text: string);
}
declare class XmlLinqT extends Observer {
    private OnListAddList;
    private OnRemoveList;
    private OnChangedList;
    _staticData: boolean;
    _path: string;
    _pathKey: string;
    _names: Arr<string>;
    constructor();
    private DoChanged(key, oldList, list);
    private ItemDoChanged(key, oldValue, newValue, item);
    Remove(name: string): void;
    GetName(index: number): string;
    GetValue(index: number): Listx;
    Exists(name: string): boolean;
    readonly Length: number;
    readonly length: number;
    OnAdd(act: Function, sx: Ix): void;
    OnRemove(act: Function, sx: Ix): void;
    OnChanged(act: Function, sx: Ix): void;
    OnAddSplice(act: Function): void;
    OnRemoveSplice(act: Function): void;
    OnChangedSplice(act: Function): void;
    ListenEmpty(act: Function, id: string, key: string, sx1: Ix): void;
    GetPageSize(pageSize: number): number;
    GetPage(pageSize: number, page: number): XmlLinqT;
    Each(func: Function): void;
    Take(size: number, skip?: number): XmlLinqT;
    s(key: string, val: any): void;
    Where(func: Function): XmlLinqT;
    Reverse(): XmlLinqT;
    Copy(): XmlLinqT;
    Count(func: Function): number;
    All(func: Function): boolean;
    Any(func: Function): boolean;
    FirstOrDefault(func: Function): Listx;
    Max(func: Function): number;
    Min(func: Function): number;
    MaxItem(func: Function): Listx;
    Sum(func: Function): number;
    Select(func: Function): Array<any>;
    ToArray(): Array<Listx>;
    RemoveAll(func: Function): XmlLinqT;
    OrderBy(key: any): XmlLinqT;
    GroupBy(func: Function): Listx;
    Add(item: Listx, keys?: any): void;
    AddKey(key: string, item: Listx): void;
    Text(): string;
    Clear(): void;
    Dispose(): void;
}
declare class Assert {
    static assertList: Listx;
    static aniAssertList: Listx;
    static classes: Arr<string>;
    static classes1: Arr<string>;
    static finished: boolean;
    private static index;
    static process: Function;
    static loaded: Function;
    static Load(process: Function, loaded: Function): void;
    private static Next();
    private static Next1();
    private static processAtlasName;
    private static Process(atlasName, nextFunc);
    static Img(name: string): Bx;
    static Trace(): void;
}
interface String {
    format(arr: Array<any>): string;
}
declare class Lang {
    static list: any;
    static type: string;
    static Setup(att: any): void;
    static Get(key: string): string;
    static Exists(key: string): string;
    static PT(val: string): string;
    static transList: Listx;
    static GetLangText(val: string): string;
    static AddTransList(val: string): void;
    static GetPlant: Function;
    static GetGoods: Function;
    static GetGoodsWithQuality: Function;
    static GetObj: Function;
}
declare class Color {
    color: number;
    constructor(argb?: number);
    Set(color?: number): void;
    readonly a: number;
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly rgb: string;
    static readonly Green: number;
    static readonly GreenGame: string;
    static Parse(color: string): Color;
}
declare class Parms {
    static phone: boolean;
}
declare class BCenter extends Sx {
    private b;
    constructor(b: any, yAlign?: number, xOffset?: number, yOffset?: number);
    readonly width: number;
    readonly height: number;
}
declare class N9 extends Sx {
    img: Bx;
    constructor(val: string, rect?: Rectangle);
    OnLoaded(loaded: Function): void;
    width: number;
    height: number;
}
declare class ColorChange {
    private static DELTA_INDEX;
    private static IDENTITY_MATRIX;
    private static LENGTH;
    data: Array<number>;
    constructor(p_matrix?: Array<number>);
    reset(): void;
    adjustColor(p_brightness: number, p_contrast: number, p_saturation: number, p_hue: number): void;
    adjustBrightness(p_val: number): void;
    adjustContrast(p_val: number): void;
    adjustSaturation(p_val: number): void;
    adjustHue(p_val: number): void;
    concat(p_matrix: Array<number>): void;
    toString(): string;
    toArray(): Array<number>;
    protected copyMatrix(p_matrix: Array<number>): void;
    protected multiplyMatrix(p_matrix: Array<number>): void;
    protected cleanValue(p_val: number, p_limit: number): number;
    protected fixMatrix(p_matrix?: Array<number>): Array<number>;
}
declare class NAniBx extends NAniBase {
    constructor(imgs: any, overAndRemove?: boolean, frameRate?: number);
    private Setup(imgs, frameRate?);
}
declare class NAniSdp extends Sx {
    ani: Sx;
    overAndRemove: boolean;
    playEndFunc: Function;
    actList: Listx;
    totalFrame: number;
    frames: any[];
    skeletonTrees: any;
    skeletonActions: any;
    skeletonSkins: any;
    actPath: any;
    constructor(resPath: any, actPath: string, loaded?: Function, overAndRemove?: boolean, frameRate?: number);
    LoadAct(actPath: string, loaded?: Function, overAndRemove?: boolean, frameRate?: number): void;
    Play(name: string, playEndFunc?: Function): void;
    _stop: boolean;
    _stopAtEnd: boolean;
    _timerHandleIndex: number;
    _frame: number;
    TimerHandle(): void;
    GetFrameVal(data1: any, data2: any, key: string): number;
    GetFrameValTween(data1: any, data2: any, key: string): number;
    StopAtEnd(): void;
    Stop(): void;
    Continue(): void;
    private End(ev);
    private _frameRate;
    frameRate: number;
}
declare class NAniSx extends NAniBase {
    private backForth;
    private intervalObj;
    private framesCount;
    private finishFunc;
    dis: Ix;
    constructor(dis: Ix, stateFrom: any, stateTo: any, frames: number, backForth?: boolean, finishFunc?: Function, overAndRemove?: boolean);
    private Setup(dis, stateFrom, stateTo, framesCount, backForth?, finishFunc?);
    readonly width: number;
    readonly height: number;
}
declare class NAniXml extends Sx {
    ani: Bx;
    path: string;
    overAndRemove: boolean;
    playEndFunc: Function;
    playEndFunc2: Function;
    actList: Listx;
    info: any;
    static getNameFunc: Function;
    static getIndexFunc: Function;
    constructor(path: string, name: string, overAndRemove?: boolean, frameRate?: number);
    static oneActList: Listx;
    static LoadOne(path: string, actList: Listx, fullImg: boolean, func: Function): void;
    static Load(path: any, func: Function, fullImg?: boolean, actList?: Listx): void;
    Play(name: string, playEndFunc?: Function): void;
    _stop: boolean;
    _stopAtEnd: boolean;
    _timerHandleIndex: number;
    _frame: number;
    TimerHandle(): void;
    readonly width: any;
    readonly height: any;
    StopAtEnd(): void;
    Stop(): void;
    Continue(): void;
    private End(ev);
    private _frameRate;
    frameRate: number;
    loadedFuncList: Arr<Function>;
    OnLoaded(func: Function): void;
    Dispose(): void;
}
declare class Csv {
    nodes: any[];
    keys: {};
    keyArr: any[];
    constructor(text: string);
}
declare class DateTime {
    d: Date;
    constructor(d?: any);
    readonly time: number;
    readonly tick: number;
    readonly Year: number;
    readonly Month: number;
    readonly DayOfWeek: number;
    readonly Day: number;
    readonly Hour: number;
    readonly Minute: number;
    readonly Second: number;
    readonly Millisecond: number;
    Add(t: TimeSpan): DateTime;
    AddDays(val: number): DateTime;
    AddHours(val: number): DateTime;
    AddMinutes(val: number): DateTime;
    AddSeconds(val: number): DateTime;
    AddMilliseconds(val: number): DateTime;
    toString(withMilliseconds?: boolean): string;
}
declare class NBColorText extends NColorText {
    constructor(item: Listx, bindKey?: string, bold?: boolean, size?: number, style?: number, act?: Function);
    ChangeBind(item: Listx): void;
}
declare class NBKLabel extends NLabel {
    constructor(key: string, item: Listx, bindKey?: string, keyType?: number, color?: number, bold?: boolean, size?: number, act?: Function);
    ChangeBind(item: Listx): void;
}
declare class NBLabel extends NLabel {
    constructor(item: Listx, bindKey?: string, color?: number, bold?: boolean, size?: number, act?: Function, stroke?: number, strokeColor?: number);
    ChangeBind(item: Listx): void;
}
declare class NButton extends Sx {
    static bgRender: Function;
    static bgOnRender: Function;
    static lRender: Function;
    static lOnRender: Function;
    private _val;
    private bOn;
    l: any;
    lOn: any;
    b: NSButton;
    private bg;
    private bgOn;
    private filterDoubleClickTime;
    private _filterDoubleClick;
    constructor(val: string, style?: number, highLight?: boolean, filterDoubleClickTime?: number);
    val: string;
    readonly width: number;
    readonly height: number;
    readonly w: number;
    readonly h: number;
    On(): void;
    Off(): void;
}
declare class NCheck extends Sx {
    static offStyle: Function;
    static onStyle: Function;
    static fontSize: number;
    val: string;
    l: Ix;
    b: Sx;
    private act;
    private p;
    private fg;
    constructor(val: string, width: number, height: number, act: Function, color?: number);
    private _check;
    check: boolean;
}
declare class NCountDown extends Sx {
    private func;
    private isTime;
    private item;
    private guid;
    private startTime;
    private allTime;
    tick: number;
    private stop;
    leftTime: number;
    private _defaultVal;
    l: any;
    constructor(isTime?: boolean, nnum?: string, size?: number, color?: number, func?: Function);
    align: number;
    defaultVal: string;
    readonly val: number;
    Start(allTime: number, finishFunc?: Function, timerFunc?: Function): void;
    Stop(): void;
    StopAt(allTime: number): void;
    Dispose(): void;
}
interface String {
    IsFull(): boolean;
    IsEmpty(): boolean;
    ToInt(): number;
    WriteLog(): void;
    TrueLength(): number;
    PaddingLeft(c: string, count: number): any;
    PaddingRight(c: string, count: number): any;
    Trim(): any;
    StartWith(c: string): any;
}
declare class Strx {
    constructor();
    static Setup(): void;
    static NUMS: Array<string>;
    static CHARS: Array<string>;
    static Rnd(max: number): number;
    static Int(text: any): number;
    static IsEmpty(text: string): boolean;
    static IsFull(text: string): boolean;
    static PaddingLeft(text: string, len: number, char: string): string;
    static PaddingRight(text: string, len: number, char: string): string;
    static Trim(str: string): string;
    static GetSmaNum(val: number): string;
    static TrueLength(text: string): number;
    static Num2Str(d: number, decimal?: number): string;
    static Decompress(buffer: Uint8Array): Uint8Array;
    static Encompress(buffer: Uint8Array): Uint8Array;
    static CalulateXYAnagle(startx: number, starty: number, endx: number, endy: number): number;
    static GetInnerText(text: string, begin: string, end: string, times?: number): string;
    static IsString(val: any): boolean;
}
declare class NGridList extends NScrollPanel {
    static empty: Listx;
    column: number;
    private _emptyToCount;
    emptyToCount: number;
    private OnAdd;
    private OnRemove;
    sxList: Listx;
    private emptyList;
    animation: boolean;
    freeStyle: boolean;
    cellWidth: number;
    cellHeight: number;
    func: Function;
    data: XmlLinqT;
    margin: number;
    defaultPanel: Sx;
    defaultFunc: Function;
    orderByFunc: Function;
    autoHide: boolean;
    constructor(w: number, h: number, column: number, emptyToCount?: number);
    HandleScrollHide(): void;
    _whereFunc: Function;
    whereFunc: Function;
    private baseChildren;
    private AddBase(sx, x?, y?);
    RemoveAllBase(): void;
    SetData(xes: XmlLinqT, cellHeight: number, func: Function, willListen?: boolean, margin?: number): void;
    Reload(): void;
    private AddOne(list);
    private LoadEmpty();
    rowCount: number;
    LoadPosition(): void;
    private PutOne(p, columnIndex, rowIndex);
    private LoadOne(p);
    readonly width: number;
    readonly height: number;
    Dispose(): void;
}
declare class NGridListPageSide extends Sx {
    g: NGridList;
    column: number;
    pageSize: number;
    xqt: XmlLinqT;
    data: Array<Listx>;
    func: Function;
    cellHeight: number;
    margin: number;
    page: number;
    orderByFunc: Function;
    w: number;
    h: number;
    canSetPageFunc: Function;
    constructor(w: number, h: number, column: number, pageSize: number, emptyToCount?: number);
    SetData(xqt: XmlLinqT, cellHeight: number, func: Function, margin?: number): void;
    SetPage(page: number): void;
    GetPageData(page: number): XmlLinqT;
    Reload(): void;
}
declare class NKLabel extends NLabel {
    constructor(key?: string, val?: string, keyType?: number, color?: number, bold?: boolean, size?: number);
}
declare class NMouseTail3 extends Sx {
    frameRage: number;
    maxLen: number;
    lenPerFrame: number;
    scaleOffset: number;
    tails: any[];
    constructor();
    poss: any[];
    prePos: any;
    pos: {
        x: number;
        y: number;
    };
    GetAngle(px: any, py: any, mx: any, my: any): number;
}
declare class NMovePanel extends NScrollPanel {
    private movedFunc;
    private moveFunc;
    constructor(width?: number, height?: number, moveFunc?: Function, movedFunc?: Function, bgType?: number, moveWidth?: number, moveHeight?: number);
    Resize(width: number, height: number): void;
    Add(item: any, x?: number, y?: number): boolean;
    Remove(item: Ix): void;
    Adjust(): void;
    MoveTo(x: number, y: number): void;
    readonly contentX: number;
    readonly contentY: number;
    scrollH: number;
    scrollV: number;
    RemoveAll(): void;
    readonly contentWidth: number;
    readonly contentHeight: number;
    SetRect(rect?: Rectangle): void;
    _disableScroll: boolean;
    DisableScroll(): void;
    DisableScrollX(): void;
    DisableScrollY(): void;
    EnableScroll(): void;
    EnableScrollX(): void;
    EnableScrollY(): void;
    Lock(): void;
    UnLock(): void;
    Dispose(): void;
}
declare class NNoPage {
    _val: number;
    private func;
    private max;
    private page;
    private inPaging;
    private g;
    private page1;
    private page2;
    constructor(g: NGridList);
    Set(page: number, max: number, func: Function): void;
}
declare class NNum extends Sx {
    static extraOffset: number;
    offset: number;
    type: string;
    leftOffset: number;
    num: string;
    constructor(num: string, type?: string, verification?: boolean, offset?: number);
    Set(num: string, type?: string, verification?: boolean): void;
    val: string;
    valNum: number;
    readonly width: number;
}
declare class NPanel extends Sx {
    static bgFunc: Function;
    showBG: boolean;
    bg: N9;
    w: number;
    h: number;
    constructor(width?: number, height?: number, bgType?: number);
    Resize(width: number, height: number): void;
    width: number;
    height: number;
    visiableInStage: boolean;
    InShow(): void;
    InHide(): void;
    Show(): void;
    Hide(): void;
    Add(s1: any, x?: number, y?: number): boolean;
}
declare class NProcess extends Sx {
    static textStyle: number;
    private _fg;
    private _fgName;
    private pFg;
    private _bg;
    l: any;
    private _width;
    private _height;
    private scroll;
    private scrollDis;
    _val: number;
    private fgWidth;
    private fgHeight;
    private processFunc;
    tweenTime: number;
    scrollType: number;
    private isheight;
    constructor(fg: any, bg?: any, l?: any, width?: number, scroll?: boolean, processFunc?: Function, isheight?: boolean);
    fgName: string;
    fg: Bx;
    val: number;
    SetVal(val?: number, tweenTime?: number): void;
    SetText(val: string): void;
    readonly width: number;
    readonly height: number;
}
declare class NPs extends Sx {
    constructor(path: string);
    Play(name: string, playEndFunc?: Function): void;
    Stop(): void;
    StopAtEnd(): void;
    private StopAtEndWhenPlayOnEnd();
    Continue(): void;
    private End(ev);
    private PlayOnEnd(ev);
    Dispose(): void;
}
declare class NRadio extends Sx {
    w: number;
    h: number;
    private act;
    data: Array<any>;
    checkList: Listx;
    private checkedCheck;
    onChanged: Function;
    private rowCount;
    private mode;
    constructor(data: Array<any>, w: number, h: number, act?: Function, onChanged?: Function, columnCount?: number, mode?: number);
    private AddCheck(val, width, height, i);
    private _selectIndex;
    selectIndex: number;
    readonly selectItem: NCheck;
    select: string;
    private PutPos();
    private static aniIco;
    static Ani(ico: Sx): void;
    private static DoAni(ico);
}
declare class NSButton extends Sx {
    obj: any;
    music: string;
    private filterDoubleClickTime;
    private _filterDoubleClick;
    static musicBG: string;
    b: any;
    bOn: any;
    constructor(b: any, bOn?: any, music?: string, highLight?: boolean, filterDoubleClickTime?: number);
    Dispose(): void;
    readonly width: number;
    readonly height: number;
    On(): void;
    Off(): void;
}
declare class NSprite extends Bx {
    constructor(path: string, width?: number, height?: number);
}
declare class NTabPanel extends Sx {
    static defaultPanelType: number;
    list: Listx;
    bList: Listx;
    tabPanel: NPanel;
    midPanel: NPanel;
    selectKey: string;
    contentP: NPanel;
    private style;
    tempButton: NButton;
    private OnTabChange;
    private mode;
    private allP;
    w: number;
    h: number;
    private panelType;
    constructor(w: number, h: number, buttonStyle?: number, OnTabChange?: Function, mode?: number, panelType?: number);
    private _offset;
    AddTab(key: string, offset?: number, type?: number): NPanel;
    private proList;
    private proFuncList;
    private tabFuncList;
    private selectProP;
    AddTabPro(key: string, func: Function, tabFunc?: Function, offset?: number, type?: number): void;
    private static PutPosition(x, y, xOffset, yOffset, items);
    private LoadXY();
    Select(index: number): void;
    readonly selectIndex: number;
    SelectKey(key: string): void;
}
declare class NText extends Sx {
    static bgRender: Function;
    private _key;
    private _val;
    keyTextField: NLabel;
    private textFieldp;
    textField: egret.TextField;
    bg: any;
    static color: number;
    func: Function;
    completeFunc: Function;
    w: number;
    h: number;
    constructor(key: string, val: string, maxSize: number, w: number, h?: number, func?: Function, completeFunc?: Function, fontSize?: number);
    private SetTextFieldPos(ev?);
    val: string;
    multiline: boolean;
    isPassword: boolean;
    private holdPlaceLabel;
    holdPlace: string;
    private HandleHoldPlace(ev);
    Dispose(): void;
}
interface ISocket {
    Connect(): any;
    Send(text: string, errFunc?: Function): any;
    SendGBK(text: string): any;
    Close(): any;
    addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): any;
    isConnected: boolean;
    socket: any;
}
declare class SocketHttp {
    constructor();
}
declare class SocketLocal {
    constructor();
}
declare class SocketTcp {
    constructor();
}
declare class SocketWs extends egret.EventDispatcher implements ISocket {
    static net: any;
    private sender;
    socket: any;
    private ip;
    private port;
    constructor(sender: Function, ip: string, port: number);
    Connect(): void;
    Send(text: string, errFunc?: Function): void;
    SendGBK(text: string): void;
    Close(): void;
    private ConnectHandler(ev);
    private DataHandler(ev);
    private CloseHandler(ev);
    readonly isConnected: boolean;
}
